from datetime import datetime
from typing import Literal

from pydantic import UUID4, BaseModel

from backend.schemas.interviews import ChatMessage


class EvaluationResponse(BaseModel):
    id: UUID4
    status: Literal["pending", "approved", "rejected"]
    candidate: str
    job_offer: str
    conducted_at: datetime | None  # should be datetime
    assessment: str | None
    score: int | None
    transcript: list[ChatMessage]
