import logging
import os

from openai import (
    OpenAI, OpenAIError, APITimeoutError, AuthenticationError,
    PermissionDeniedError, RateLimitError, APIStatusError, APIConnectionError,
)
from pydantic import ValidationError

from ..schemas import EvidenceSelection
from .prompts import SYSTEM_INSTRUCTION, evidence_input

logger = logging.getLogger(__name__)


class ProviderUnavailable(Exception):
    def __init__(self, message="The AI service is temporarily unavailable.", *, category="unavailable"):
        self.category = category
        super().__init__(message)


def failure(category: str, message: str, status: int | None = None) -> ProviderUnavailable:
    # Never log exception strings, provider bodies, prompts, headers, or keys.
    logger.warning("ai_provider_failure category=%s status=%s", category, status)
    return ProviderUnavailable(message, category=category)


def select_evidence(question: str, sources: list[dict]) -> EvidenceSelection:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "").strip()
    if not key or not model:
        raise failure("configuration", "The AI service is not configured. Please contact the project team.")
    try:
        # Live-tested with Groq gpt-oss-120b; preserve supported structured parsing.
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
            raise failure("invalid_output", "The AI service returned an invalid answer. Please try again.")
        return parsed
    except APITimeoutError:
        raise failure("timeout", "The AI service took too long. Please try again.") from None
    except AuthenticationError:
        raise failure("authentication", "The AI service could not authenticate. Please contact the project team.", 401) from None
    except PermissionDeniedError:
        raise failure("rejection", "The AI service rejected the request. Please contact the project team.", 403) from None
    except RateLimitError:
        raise failure("rate_limit", "The AI service is busy. Please try again later.", 429) from None
    except APIStatusError as error:
        if error.status_code < 500:
            raise failure("rejection", "The AI service rejected the request. Please contact the project team.", error.status_code) from None
        raise failure("unavailable", "The AI service is temporarily unavailable.", error.status_code) from None
    except APIConnectionError:
        raise failure("unavailable", "The AI service could not be reached. Please try again.") from None
    except (ValidationError, ValueError, IndexError):
        raise failure("invalid_output", "The AI service returned an invalid answer. Please try again.") from None
    except OpenAIError:
        raise failure("invalid_output", "The AI service returned an invalid answer. Please try again.") from None
