from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    question: str = Field(min_length=1, max_length=4000)
    course_id: Optional[int] = Field(default=None, gt=0)


class Source(BaseModel):
    id: int
    title: str
    excerpt: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    grounded: bool


class EvidenceQuote(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    source_id: int
    quote: str


class EvidenceSelection(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    sufficient: bool
    quotes: list[EvidenceQuote]
