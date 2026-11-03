from fastapi import APIRouter, HTTPException

from ..retrieval import search_course_materials
from ..schemas import ChatRequest, ChatResponse, Source
from ..services.llm import ProviderUnavailable, select_evidence
from ..services.prompts import FALLBACK

router = APIRouter()


def fallback() -> ChatResponse:
    return ChatResponse(answer=FALLBACK, grounded=False, sources=[])


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    sources = search_course_materials(request.question, course_id=request.course_id)
    if not sources:
        return fallback()  # Crucially, no provider call or API key needed.
    try:
        selection = select_evidence(request.question, sources)
    except ProviderUnavailable as error:
        raise HTTPException(status_code=503, detail=str(error)) from None
    if not selection.sufficient or not selection.quotes:
        return fallback()
    by_id = {source["id"]: source for source in sources}
    used = {}
    answers = []
    for item in selection.quotes:
        source = by_id.get(item.source_id)
        quote = item.quote.strip()
        if source is None or not quote or quote not in source["excerpt"]:
            return fallback()
        used[item.source_id] = Source(**source)
        answers.append(f'{quote} (Source: {source["title"]})')
    # Serve verified verbatim evidence, so the model cannot insert invented facts.
    return ChatResponse(answer="\n".join(answers), grounded=True, sources=list(used.values()))
