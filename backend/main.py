from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import interviews, offers, recruiter
from .config import settings

app = FastAPI(title=f"{settings.app_name} API", version=settings.version)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(offers.router, prefix="/api")
app.include_router(interviews.router, prefix="/api")
app.include_router(recruiter.router, prefix="/api")

app.frontend("/", directory="dist")
