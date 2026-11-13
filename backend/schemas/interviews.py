from typing import Literal

from pydantic import UUID4, BaseModel


class ChatMessage(BaseModel):
    id: UUID4
    interview_id: UUID4
    text: str
    user: Literal["interviewer", "candidate"]
