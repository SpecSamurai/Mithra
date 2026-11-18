from http import HTTPStatus
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import UUID4
from sqlalchemy import select

from backend.database.database import SessionLocal
from backend.database.models import Interview
from backend.schemas.recruiter import EvaluationResponse

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.get("/evaluations")
def evaluations(
    status: Literal["pending", "approved", "rejected"] | None,
) -> list[EvaluationResponse]:
    with SessionLocal() as session, session.begin():
        query = select(Interview)

        if status is not None:
            query = query.where(Interview.status == status)

        interviews = session.scalars(query.order_by(Interview.conducted_at)).all()
        return [
            EvaluationResponse(
                id=interview.public_id,
                job_offer=interview.application.job_offer.title,
                candidate=interview.application.candidate,
                status=interview.status,
                score=interview.score,
                conducted_at=interview.conducted_at,
                assessment=interview.summary,
                transcript=[],
            )
            for interview in interviews
        ]


@router.get("/evaluations/{id}")
def get_evaluation(id: UUID4) -> EvaluationResponse:
    with SessionLocal() as session, session.begin():
        interview = session.scalar(select(Interview).where(Interview.public_id == id))

        if interview is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, detail="Evaluation not found"
            )

        return EvaluationResponse(
            id=interview.public_id,
            job_offer=interview.application.job_offer.title,
            candidate=interview.application.candidate,
            status=interview.status,
            score=interview.score,
            conducted_at=interview.conducted_at,
            assessment=interview.summary,
            transcript=[],
        )


@router.post("/evaluations/{id}/{status}", status_code=HTTPStatus.NO_CONTENT)
def change_status(id: UUID4, status: Literal["approved", "rejected"]) -> None:
    with SessionLocal() as session, session.begin():
        interview = session.scalar(select(Interview).where(Interview.public_id == id))

        if interview is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, detail="Evaluation not found"
            )

        interview.status = status
