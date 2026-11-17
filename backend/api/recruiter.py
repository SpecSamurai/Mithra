from fastapi import APIRouter

from ..schemas.recruiter import Evaluation

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.get("")
def evaluations() -> list[Evaluation]:
    return []
