import re
from datetime import date, datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException

from ..retrieval import search_course_materials, list_deadlines, deadline_source
from ..schemas import ChatRequest, ChatResponse, Source
from ..services.llm import ProviderUnavailable, select_evidence
from ..services.prompts import FALLBACK

router = APIRouter()


def fallback() -> ChatResponse:
    return ChatResponse(answer=FALLBACK, grounded=False, sources=[])


def reference_date() -> date:
    return datetime.now(ZoneInfo("Asia/Almaty")).date()


def deadline_listing(request: ChatRequest) -> ChatResponse | None:
    # Full-match grammar prevents specific or unknown-course questions from
    # accidentally becoming an all-course list (e.g. "Physics deadlines").
    question = " ".join(re.findall(r"[a-z0-9]+", request.question.lower()))
    pattern = (r"(?:what deadlines (?:do i have|i have)|show (?:all )?deadlines|"
               r"what assignments are due|list (?:all |upcoming )?deadlines|"
               r"(?:what are (?:the |my )?)?upcoming deadlines)")
    if not re.fullmatch(pattern, question):
        return None
    items = list_deadlines(request.course_id)
    heading = "Fictional sample course deadlines (not a personal schedule)."
    if "upcoming" in question:
        today = reference_date()
        items = [item for item in items if item["due_date"] >= today.isoformat()]
        heading += f" Upcoming from {today.isoformat()} (Asia/Almaty, inclusive)."
    if not items:
        return ChatResponse(answer=heading + " No matching deadlines are stored.", sources=[], grounded=True)
    sources = [Source(**deadline_source(item)) for item in items]
    return ChatResponse(answer=heading + "\n" + "\n".join(
        f"{source.excerpt} (Source: {source.title})" for source in sources),
        sources=sources, grounded=True)


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    listing = deadline_listing(request)
    if listing is not None:
        return listing
    sources = search_course_materials(request.question, course_id=request.course_id)
    if not sources:
        return fallback()  # Crucially, no provider call or API key needed.
    try:
        selection = select_evidence(request.question, sources)
    except ProviderUnavailable as error:
        raise HTTPException(status_code=503, detail=str(error),
                            headers={"X-SmartCampus-Error": error.category}) from None
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
