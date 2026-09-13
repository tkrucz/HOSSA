import sys
from pathlib import Path

# This file lives in backend/, so parent.parent is the HOSSA project root -
# matches where frontend/dist and db/schema_sqlite.sql live when running
# from source.
PROJECT_ROOT = Path(__file__).resolve().parent.parent


def resource_path(relative_path: str) -> Path:
    """Resolves a path to a bundled resource (frontend/dist/, db/schema_sqlite.sql).

    When running from source, this is just PROJECT_ROOT / relative_path.
    When frozen into a PyInstaller executable, bundled data files get
    unpacked to sys._MEIPASS at runtime instead - a temp folder that has
    nothing to do with where the .py files "live" conceptually anymore.
    """
    if getattr(sys, "frozen", False):
        base = Path(sys._MEIPASS)  # type: ignore[attr-defined]
    else:
        base = PROJECT_ROOT

    return base / relative_path