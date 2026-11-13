from collections.abc import AsyncIterable
from typing import Annotated

from fastapi import APIRouter, Form
from fastapi.sse import EventSourceResponse
from pydantic import UUID4

from ..schemas.interviews import ChatMessage

router = APIRouter(prefix="/interviews", tags=["Interviews"])

messages = []


@router.post("")
def start_interview():
    print("Started interview")


@router.put("/{id}/messages")
def add_message(id: UUID4, message: Annotated[ChatMessage, Form()]):
    print(f"Interview: {id}")
    messages.append(message)


@router.get("", response_class=EventSourceResponse)
async def get_messages() -> AsyncIterable[ChatMessage]:
    for item in messages:
        yield item
