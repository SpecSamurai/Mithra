from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from ..config import settings

engine = create_engine(
    settings.database_connection_string.get_secret_value(),
    echo=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass
