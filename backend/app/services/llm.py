import os

from openai import (
    OpenAI, OpenAIError, APITimeoutError, AuthenticationError,
    PermissionDeniedError, RateLimitError,
)

from ..schemas import EvidenceSelection
from .prompts import SYSTEM_INSTRUCTION, evidence_input


class ProviderUnavailable(Exception):
    def __init__(self, message="The AI service is temporarily unavailable."):
        super().__init__(message)


def select_evidence(question: str, sources: list[dict]) -> EvidenceSelection:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "").strip()
    if not key or not model:
        raise ProviderUnavailable("The AI service is not configured. Please contact the project team.")
    try:
        # No SDK retries: one bounded provider request per chat request.
        with OpenAI(
            api_key=key,
            base_url=os.getenv("OPENAI_BASE_URL") or None,
            timeout=20.0,
            max_retries=0,
        ) as client:
            completion = client.beta.chat.completions.parse(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_INSTRUCTION},
                    {"role": "user", "content": evidence_input(question, sources)},
                ],
                response_format=EvidenceSelection,
            )
        parsed = completion.choices[0].message.parsed
        if parsed is None:
            return EvidenceSelection(sufficient=False, quotes=[])
        return parsed
    except APITimeoutError:
        raise ProviderUnavailable("The AI service took too long. Please try again.") from None
    except (AuthenticationError, PermissionDeniedError):
        raise ProviderUnavailable("The AI service could not authenticate. Please contact the project team.") from None
    except RateLimitError:
        raise ProviderUnavailable("The AI service is busy. Please try again later.") from None
    except (OpenAIError, ValueError, IndexError):
        raise ProviderUnavailable() from None
