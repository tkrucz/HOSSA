import os
from pathlib import Path

from dotenv import load_dotenv

# Loads a `.env` file placed next to this project's root (same folder as
# this `backend` package). On a fresh PC, copy `.env.example` to `.env` and
# fill in the values for that machine - no source files need editing.
load_dotenv()


def _require(name: str, default: str | None = None) -> str:
    value = os.environ.get(name, default)
    if value is None:
        raise RuntimeError(
            f"Missing required environment variable '{name}'. "
            f"Copy .env.example to .env and set it."
        )
    return value


# relative_path values are stored as Windows-style paths, e.g.
# "Projekt 1\Podkatalog 1\Dokument 11.pdf" - split on backslash, not "/".
# Centralized here so every module that parses relative_path agrees on it.
PATH_SEP = "\\"

# Where the filesystem sync job scans for documents. This is the one value
# that's genuinely different per machine/deployment.
DOCUMENTS_FOLDER = _require("DOCUMENTS_FOLDER")

# Postgres connection. Either set DATABASE_URL directly, or set the
# individual PG_* pieces below and this builds it for you.
PG_USER = os.environ.get("PG_USER", "postgres")
PG_PASSWORD = os.environ.get("PG_PASSWORD", "haslo123")
PG_HOST = os.environ.get("PG_HOST", "localhost")
PG_PORT = os.environ.get("PG_PORT", "5431")
PG_DATABASE = os.environ.get("PG_DATABASE", "hossa")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"postgresql+psycopg2://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}",
)

# JWT signing secret - MUST be set to a real random value outside of local
# dev. See auth.py for where this is consumed.
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")

# Sanity check the documents folder actually exists, so a typo in .env
# fails loudly at startup instead of silently scanning nothing.
if not Path(DOCUMENTS_FOLDER).exists():
    raise RuntimeError(
        f"DOCUMENTS_FOLDER '{DOCUMENTS_FOLDER}' does not exist on this machine. "
        f"Check the path in your .env file."
    )