from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import UUID4

from ..schemas.jobs import ApplicationCreate, JobPosition, jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("")
async def get_jobs() -> list[JobPosition]:
    return jobs


@router.post("/{job_id}/applications", status_code=HTTPStatus.CREATED)
async def apply(
    job_id: UUID4,
    full_name: Annotated[str, Form(min_length=1, max_length=200)],
    cv: Annotated[UploadFile, File(...)],
) -> ApplicationCreate:
    job = next((job for job in jobs if job.id == job_id), None)

    if job is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail="Job position not found."
        )

    print(f"Added {full_name}'c CV {cv.filename} to the db")

    return ApplicationCreate(
        id="f49fade2-66b3-40c7-b316-e3d4ce8bed0c", job_id=job_id, status="Pending"
    )
