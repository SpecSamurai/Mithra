from fastapi import FastAPI

from .config import settings
from .routers import jobs

app = FastAPI(title=f"{settings.app_name} API", version=settings.version)

app.include_router(jobs.router, prefix="/api")

app.frontend("/", directory="dist")
