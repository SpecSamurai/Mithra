from pydantic import UUID4, BaseModel


class JobOffer(BaseModel):
    id: UUID4
    title: str
    description: str


jobs = [
    JobOffer(
        id="d6485385-0bab-46fa-a1f3-61ce3b077d8a",
        title="Backend Engineer (Python)",
        description="Build APIs with FastAPI and design data pipelines.",
    ),
    JobOffer(
        id="f543687b-c4df-4479-926e-506b1b4cb4c9",
        title="Frontend Engineer (React)",
        description="Own the web app UI, built with React and TypeScript.",
    ),
    JobOffer(
        id="cd485ecf-81c8-4f3a-b15f-15dff754f612",
        title="ML Engineer",
        description="Ship LLM-powered features and evaluation tooling.",
    ),
    JobOffer(
        id="f49fade2-66b3-40c7-b316-e3d4ce8bed0c",
        title="Product Designer",
        description="Design end-to-end product experiences.",
    ),
]


class ApplicationCreate(BaseModel):
    id: UUID4
    job_id: UUID4
    status: str
