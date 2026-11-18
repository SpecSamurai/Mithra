from pydantic import UUID4, BaseModel


class JobOfferResponse(BaseModel):
    id: UUID4
    title: str
    description: str
