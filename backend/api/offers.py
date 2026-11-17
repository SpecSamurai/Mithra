from http import HTTPStatus
from pathlib import Path
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import UUID4
from sqlalchemy import select

from backend.config import settings
from backend.database.database import SessionLocal
from backend.database.models import Application, JobOffer
from backend.schemas.offers import ApplicationCreate, JobOfferResponse

router = APIRouter(prefix="/offers", tags=["Offers"])


@router.get("")
def get_jobs() -> list[JobOfferResponse]:
    with SessionLocal() as session, session.begin():
        offers = session.scalars(select(JobOffer).order_by(JobOffer.id)).all()
    return [
        JobOfferResponse(
            id=offer.public_id, title=offer.title, description=offer.description
        )
        for offer in offers
    ]


@router.post("/{offer_id}/applications", status_code=HTTPStatus.CREATED)
async def apply(
    offer_id: UUID4,
    full_name: Annotated[str, Form(min_length=1, max_length=200)],
    cv: Annotated[UploadFile, File(...)],
) -> ApplicationCreate:
    suffix = Path(cv.filename or "").suffix.lower()
    data = await cv.read()

    application_id = uuid4()
    relative_path = f"blobs/{application_id}{suffix}"

    with SessionLocal() as session, session.begin():
        offer = session.scalar(select(JobOffer).where(JobOffer.public_id == offer_id))

        if offer is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Job position not found.",
            )

        settings.blobs_dir.mkdir(parents=True, exist_ok=True)
        destination = settings.blobs_dir / f"{application_id}{suffix}"
        destination.write_bytes(data)
        session.add(
            Application(
                public_id=application_id,
                candidate=full_name,
                cv_url=relative_path,
                job_offer_id=offer.id,
            )
        )

    return ApplicationCreate(id=application_id, job_offer_id=offer_id, status="pending")
