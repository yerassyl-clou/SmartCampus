"""CR-001 request contract; independent of the existing chat models."""
from typing import Annotated, Literal
import unicodedata

from pydantic import BaseModel, ConfigDict, Field, UUID4, field_validator, model_validator

SourceId = Annotated[int, Field(strict=True, ge=-(2**63), le=2**63 - 1)]
IssueType = Literal['incorrect_information', 'outdated_information', 'missing_information', 'other']


class FeedbackRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    response_id: UUID4
    rating: Literal['helpful', 'not_helpful']
    issue_type: IssueType | None = None
    comment: str | None = Field(default=None, strict=True, max_length=500)
    source_ids: list[SourceId] = Field(default_factory=list)

    @field_validator('source_ids')
    @classmethod
    def nonzero_sources(cls, values: list[int]) -> list[int]:
        if 0 in values:
            raise ValueError('Source IDs must be nonzero.')
        return values

    @field_validator('comment')
    @classmethod
    def clean_comment(cls, value: str | None) -> str | None:
        if value is None:
            return None
        # Store plain text only. Never interpret markup; future viewers must
        # render this as text. Length validation runs before cleanup.
        value = ''.join(char for char in value if char in '\n\t' or not unicodedata.category(char).startswith('C'))
        return value.strip() or None

    @model_validator(mode='after')
    def negative_requires_category(self):
        if self.rating == 'not_helpful' and self.issue_type is None:
            raise ValueError('Not helpful feedback requires an issue category.')
        return self


class FeedbackResponse(BaseModel):
    id: int = Field(gt=0)
    status: Literal['saved'] = 'saved'
