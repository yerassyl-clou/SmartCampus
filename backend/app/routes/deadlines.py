from __future__ import annotations

from typing import Annotated, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from ..retrieval import list_deadlines

router = APIRouter()


class DeadlineResponse(BaseModel):
    id: int
    course_id: int
    course_name: str
    title: str
    due_date: str
    source_title: str


class DeadlinesResponse(BaseModel):
    items: list[DeadlineResponse]
    total: int


@router.get("/api/deadlines", response_model=DeadlinesResponse)
def deadlines(
    course_id: Annotated[Optional[int], Query(description="Optional course ID")] = None,
) -> DeadlinesResponse:
    items = list_deadlines(course_id)
    return DeadlinesResponse(items=items, total=len(items))
