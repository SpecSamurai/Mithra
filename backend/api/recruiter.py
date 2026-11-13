from fastapi import APIRouter

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.get("")
def test():
    pass
