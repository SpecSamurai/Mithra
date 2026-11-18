import uuid
from datetime import datetime
from typing import Literal
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, SmallInteger, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class JobOffer(Base):
    __tablename__ = "job_offers"
    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[uuid.UUID] = mapped_column(Uuid, unique=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String)
    applications: Mapped[list[Application]] = relationship(back_populates="job_offer")


class Application(Base):
    __tablename__ = "applications"
    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[uuid.UUID] = mapped_column(Uuid, unique=True, default=uuid4)
    candidate: Mapped[str] = mapped_column(String(200))
    cv_url: Mapped[str] = mapped_column(String(200))
    job_offer_id: Mapped[int] = mapped_column(ForeignKey("job_offers.id"))
    job_offer: Mapped[JobOffer] = relationship(back_populates="applications")
    interview: Mapped[Interview | None] = relationship(back_populates="application")


class Interview(Base):
    __tablename__ = "interviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[uuid.UUID] = mapped_column(Uuid, unique=True, default=uuid4)
    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id"), unique=True
    )
    conducted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[Literal["pending", "approved", "rejected"]] = mapped_column(
        String(20)
    )  # created, pending, finished
    score: Mapped[int | None] = mapped_column(SmallInteger)
    summary: Mapped[str | None] = mapped_column(String)
    application: Mapped[Application] = relationship(back_populates="interview")
    messages: Mapped[list[Message]] = relationship(back_populates="interview")


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[uuid.UUID] = mapped_column(Uuid, unique=True, default=uuid4)
    interview_id: Mapped[int] = mapped_column(ForeignKey("interviews.id"))
    role: Mapped[Literal["interviewer", "candidate"]] = mapped_column(String(20))
    text: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    interview: Mapped[Interview] = relationship(back_populates="messages")
