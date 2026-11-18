import datetime
from collections.abc import AsyncIterable
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Form, HTTPException
from fastapi.sse import EventSourceResponse
from pydantic import UUID4
from sqlalchemy import select

from backend.database.database import SessionLocal
from backend.database.models import Interview, Message

from ..schemas.interviews import ChatMessage

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("/{id}/start", status_code=HTTPStatus.CREATED)
def start_interview(id: UUID4):
    with SessionLocal() as session, session.begin():
        interview = session.scalar(select(Interview).where(Interview.public_id == id))

        if interview is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, detail="Interview not found."
            )

        interview.conducted_at = datetime.datetime.now(tz=datetime.UTC)
        interview.status = "pending"


@router.put("/{id}/messages")
def add_message(id: UUID4, message: Annotated[ChatMessage, Form()]):
    with SessionLocal() as session, session.begin():
        interview = session.scalar(select(Interview).where(Interview.public_id == id))

        if interview is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, detail="Interview not found."
            )

    interview.messages.append(
        Message(
            role=message.user,
            text=message.text,
            created_at=datetime.datetime.now(tz=datetime.UTC),
        )
    )


@router.get("/{id}/messages", response_class=EventSourceResponse)
async def get_messages() -> AsyncIterable[ChatMessage]:
    with SessionLocal() as session, session.begin():
        interview = session.scalar(select(Interview).where(Interview.public_id == id))

        if interview is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, detail="Interview not found."
            )

    for item in interview.messages:
        yield ChatMessage(
            id=item.public_id,
            text=item.text,
            user=item.role,
        )
