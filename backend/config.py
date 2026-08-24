import os
from pathlib import Path

from dotenv import load_dotenv

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
PATH_SEP = "\\"

# Where the filesystem sync job scans for documents. In this standalone
# build this will eventually come from a folder-picker in the app itself
# rather than a .env file - see the roadmap notes in DEPLOY_STANDALONE.md.
DOCUMENTS_FOLDER = _require("DOCUMENTS_FOLDER")

# SQLite database file. Defaults to a file named hossa.sqlite3 next to
# wherever the app is run from - no server, no separate install, nothing
# else needed on the machine.
DATABASE_PATH = os.environ.get("DATABASE_PATH", "hossa.sqlite3")

# JWT signing secret - MUST be a real random value in anything beyond local
# dev/single-machine use. See auth.py for where this is consumed.
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")

if not Path(DOCUMENTS_FOLDER).exists():
    raise RuntimeError(
        f"DOCUMENTS_FOLDER '{DOCUMENTS_FOLDER}' does not exist on this machine. "
        f"Check the path in your .env file."
    )