from pydantic import BaseModel, UUID4

class Evaluation(BaseModel):
    id: UUID4
