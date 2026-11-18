from typing import Literal

from pydantic import UUID4, BaseModel


class InterviewSummary(BaseModel):
    id: UUID4
    job_offer: str

class ChatMessage(BaseModel):
    id: UUID4
    text: str
    user: Literal["interviewer", "candidate"]
