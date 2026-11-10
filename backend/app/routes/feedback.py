"""Feedback transport. SIS1011-13 owns the production storage helper."""
from importlib import import_module
import logging

from fastapi import APIRouter, Depends, HTTPException

from ..db import DatabaseUnavailable
from ..feedback_schemas import FeedbackRequest, FeedbackResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def get_feedback_store():
    # Defer importing the parallel DB workstream so chat/deadlines and app
    # startup continue to work before the storage helper is integrated.
    try:
        return import_module('app.feedback_store')
    except ModuleNotFoundError as error:
        if error.name != 'app.feedback_store':
            raise
        return None


@router.post('/api/feedback', response_model=FeedbackResponse, status_code=201,
             responses={409: {'description': 'Feedback already submitted for this response UUID.'},
                        503: {'description': 'Feedback storage unavailable.'}})
def submit_feedback(request: FeedbackRequest, store=Depends(get_feedback_store)) -> FeedbackResponse:
    try:
        if store is None:
            raise DatabaseUnavailable()
        try:
            record_id = store.save_feedback(
                response_id=str(request.response_id), rating=request.rating,
                issue_type=request.issue_type, comment=request.comment,
                source_ids=request.source_ids,
            )
        except store.DuplicateFeedback:
            raise HTTPException(status_code=409, detail='Feedback has already been submitted for this response.') from None
    except DatabaseUnavailable:
        # Do not log bodies, comments, paths, SQL or exception strings.
        logger.warning('feedback_failure category=feedback_unavailable')
        raise HTTPException(status_code=503,
                            detail='Feedback storage is temporarily unavailable. Please try again later.',
                            headers={'X-SmartCampus-Error': 'feedback_unavailable'}) from None
    return FeedbackResponse(id=record_id)
