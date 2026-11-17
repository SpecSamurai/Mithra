from pydantic import UUID4, BaseModel


class JobOfferResponse(BaseModel):
    id: UUID4
    title: str
    description: str


class ApplicationCreate(BaseModel):
    id: UUID4
    job_offer_id: UUID4
    status: str
