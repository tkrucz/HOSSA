import sqlite3

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from backend.config import DATABASE_PATH


def _split_part(value, delimiter, index):
    """Re-implements Postgres's split_part(string, delimiter, field) for
    SQLite, which has no built-in equivalent. field is 1-indexed; returns
    '' (not NULL) when the index is out of range, matching Postgres -
    only a NULL input value itself produces NULL, same as Postgres.
    """
    if value is None:
        return None

    parts = value.split(delimiter)
    idx = index - 1

    if 0 <= idx < len(parts):
        return parts[idx]

    return ""


# check_same_thread=False: FastAPI/uvicorn may hand requests to different
# worker threads than the one that created the engine. Safe here because
# SQLAlchemy's own connection pooling still serializes actual DB access
# per-connection - this flag just stops sqlite3's own (stricter, and for
# our purposes unnecessary) same-thread check from raising first.
engine = create_engine(
    f"sqlite:///{DATABASE_PATH}",
    connect_args={"check_same_thread": False},
)


# Registers split_part() on every raw connection the SQLAlchemy pool
# creates, so `func.split_part(...)` in main.py/sync.py's ORM queries
# works identically to how it did against Postgres.
@event.listens_for(engine, "connect")
def _register_sqlite_functions(dbapi_connection, connection_record):
    dbapi_connection.create_function("split_part", 3, _split_part)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Provides a low-level SQLite connection used by the synchronization
# process (synchronizer/repository.py), which does direct SQL outside of
# the SQLAlchemy ORM session - mirrors the original psycopg2-based version.
class Database:

    def __init__(self, database_path=None):
        self.connection = sqlite3.connect(
            database_path or DATABASE_PATH,
            check_same_thread=False,
        )
        self.connection.execute("PRAGMA foreign_keys = ON")
        self.connection.create_function("split_part", 3, _split_part)

    def get_connection(self):
        return self.connection