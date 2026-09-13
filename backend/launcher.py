import json
import os
import secrets
import sqlite3
import sys
import threading
import time
import tkinter as tk
import traceback
import webbrowser
from pathlib import Path
from tkinter import filedialog, messagebox

import uvicorn

from backend.paths import PROJECT_ROOT, resource_path

# Running this file directly (`python backend/launcher.py`) puts backend/'s
# own folder on sys.path, NOT the project root - so uvicorn.run() below
# would fail to resolve "backend.main:app" without this. Not needed when
# frozen - PyInstaller's bundle already makes `backend` importable on its
# own.
if not getattr(sys, "frozen", False) and str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def get_app_data_dir() -> Path:
    """Per-user, writable location for this app's settings + database.
    Deliberately NOT inside the install directory: that may not be
    writable (e.g. under Program Files), and a PyInstaller one-file build
    unpacks itself to a fresh temp folder on every single launch, so
    anything written there is lost immediately.
    """
    base = os.environ.get("APPDATA")  # Windows
    if not base:
        base = str(Path.home() / ".local" / "share")  # macOS/Linux fallback

    app_dir = Path(base) / "HOSSA"
    app_dir.mkdir(parents=True, exist_ok=True)
    return app_dir


def load_settings(app_dir: Path) -> dict:
    settings_path = app_dir / "settings.json"
    if settings_path.exists():
        try:
            return json.loads(settings_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def save_settings(app_dir: Path, settings: dict) -> None:
    (app_dir / "settings.json").write_text(
        json.dumps(settings, indent=2), encoding="utf-8"
    )


def ensure_jwt_secret(app_dir: Path, settings: dict) -> str:
    """Generates a real random secret the first time this app ever runs,
    instead of relying on the hardcoded dev fallback in config.py - the
    person running this never has to know this exists."""
    if "jwt_secret_key" not in settings:
        settings["jwt_secret_key"] = secrets.token_hex(32)
        save_settings(app_dir, settings)
    return settings["jwt_secret_key"]


def ensure_database(db_path: Path) -> None:
    """Creates the SQLite database from schema_sqlite.sql if it doesn't
    exist yet - so there's no manual setup command to run before first
    launch."""
    if db_path.exists():
        return

    schema_path = resource_path("db/schema_sqlite.sql")

    if not schema_path.is_file():
        raise FileNotFoundError(f"Nie znaleziono schematu bazy danych: {schema_path}")

    conn = sqlite3.connect(str(db_path))
    try:
        conn.executescript(schema_path.read_text(encoding="utf-8"))
        conn.commit()
    finally:
        conn.close()


def pick_documents_folder(current: str | None) -> str | None:
    """Shows a small native window with the current folder (if any) and
    buttons to start or change it. Returns the chosen folder, or None if
    the window was closed without ever picking one.
    """
    result = {"folder": current}

    root = tk.Tk()
    root.title("HOSSA - Dokumentacja projektu")
    root.geometry("480x200")
    root.resizable(False, False)

    tk.Label(
        root, text="Folder z dokumentami:", font=("Segoe UI", 10, "bold")
    ).pack(pady=(20, 4))

    folder_var = tk.StringVar(value=current or "(nie wybrano)")
    tk.Label(
        root, textvariable=folder_var, wraplength=440, fg="#333333"
    ).pack(pady=(0, 16))

    def choose():
        chosen = filedialog.askdirectory(title="Wybierz folder z dokumentami")
        if chosen:
            result["folder"] = chosen
            folder_var.set(chosen)

    def start():
        if not result["folder"]:
            messagebox.showwarning(
                "HOSSA", "Najpierw wybierz folder z dokumentami."
            )
            return
        root.destroy()

    button_row = tk.Frame(root)
    button_row.pack(pady=14)

    tk.Button(button_row, text="Zmień folder…", command=choose, width=16).pack(
        side="left", padx=6
    )
    tk.Button(
        button_row,
        text="Uruchom",
        command=start,
        width=16,
        bg="#1f2430",
        fg="white",
    ).pack(side="left", padx=6)

    root.mainloop()
    return result["folder"]


def open_browser_when_ready():
    # Gives uvicorn a moment to actually bind the port before pointing a
    # browser at it - crude but reliable enough for a local single-user app.
    time.sleep(1.5)
    webbrowser.open("http://127.0.0.1:8000")


def main():
    app_dir = get_app_data_dir()
    print(f"[HOSSA] App data dir: {app_dir}")
    settings = load_settings(app_dir)

    documents_folder = pick_documents_folder(settings.get("documents_folder"))
    if not documents_folder:
        print("[HOSSA] No folder chosen - exiting.")
        return

    print(f"[HOSSA] Documents folder: {documents_folder}")
    settings["documents_folder"] = documents_folder
    save_settings(app_dir, settings)

    jwt_secret = ensure_jwt_secret(app_dir, settings)
    db_path = app_dir / "hossa.sqlite3"
    print(f"[HOSSA] Database path: {db_path}")

    try:
        ensure_database(db_path)
        print("[HOSSA] Database ready.")
    except Exception:
        traceback.print_exc()
        messagebox.showerror(
            "HOSSA", f"Nie udało się przygotować bazy danych:\n{traceback.format_exc()}"
        )
        return

    os.environ["DOCUMENTS_FOLDER"] = documents_folder
    os.environ["JWT_SECRET_KEY"] = jwt_secret
    os.environ["DATABASE_PATH"] = str(db_path)

    print(f"[HOSSA] FRONTEND_DIST resolves to: {resource_path('frontend/dist')}")
    print(f"[HOSSA] index.html exists: {(resource_path('frontend/dist') / 'index.html').is_file()}")

    threading.Thread(target=open_browser_when_ready, daemon=True).start()

    print("[HOSSA] Starting uvicorn on http://127.0.0.1:8000 ...")
    try:
        # Importing the app object directly (rather than passing the
        # string "backend.main:app" for uvicorn to resolve dynamically at
        # runtime) is deliberate: PyInstaller's bundler works by statically
        # tracing real `import` statements to decide what to include.
        # uvicorn's string-based app loading uses importlib.import_module()
        # at runtime instead, which PyInstaller can't see through - so
        # backend.main (and everything it imports: FastAPI, SQLAlchemy,
        # this app's own config/database/models/sync/auth modules) never
        # actually got bundled, causing "Could not import module
        # backend.main" despite the module clearly being right there in
        # this project. A normal import fixes that; the tradeoff is that
        # uvicorn's --reload flag needs a string reference to work, but
        # reload is meaningless for a frozen executable anyway.
        from backend.main import app as fastapi_app

        uvicorn.run(
            fastapi_app,
            host="127.0.0.1",
            port=8000,
            log_config=None,
        )
    except Exception:
        traceback.print_exc()
        messagebox.showerror(
            "HOSSA", f"Nie udało się uruchomić aplikacji:\n{traceback.format_exc()}"
        )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # With console=False in the PyInstaller build, there's no terminal
        # for a traceback to print to - anything uncaught here would
        # otherwise just vanish, leaving someone staring at nothing with no
        # idea what happened.
        try:
            messagebox.showerror("HOSSA", f"Nieoczekiwany błąd:\n{exc}")
        except Exception:
            pass
