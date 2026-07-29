import os
import subprocess
import sys
from datetime import date

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import Document, Status, DocumentVersion, User
from backend.sync import sync_documents
from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

# relative_path values are stored as Windows-style paths, e.g.
# "Projekt 1\Podkatalog 1\Dokument 11.pdf" - split on backslash, not "/"
PATH_SEP = "\\"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def user_display_name(user: User | None) -> str | None:
    if user is None:
        return None
    return f"{user.user_name} {user.user_surname}"


class RegisterRequest(BaseModel):
    user_name: str
    user_surname: str
    login: str
    password: str


class LoginRequest(BaseModel):
    login: str
    password: str


@app.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.login == payload.login).first()
    if existing is not None:
        raise HTTPException(status_code=400, detail="Ten login jest już zajęty")

    user = User(
        user_name=payload.user_name,
        user_surname=payload.user_surname,
        login=payload.login,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "name": user_display_name(user),
            "login": user.login,
        },
    }


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == payload.login).first()

    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Nieprawidłowy login lub hasło")

    token = create_access_token(user.user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "name": user_display_name(user),
            "login": user.login,
        },
    }


@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.user_id,
        "name": user_display_name(current_user),
        "login": current_user.login,
    }


@app.post("/sync")
def sync():
    try:
        result = sync_documents()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return result


@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = (
        db.query(
            func.split_part(Document.relative_path, PATH_SEP, 1).label("project"),
            func.count(Document.document_id).label("count"),
        )
        .group_by("project")
        .order_by("project")
        .all()
    )

    return [{"id": p[0], "name": p[0], "count": p[1]} for p in projects]


@app.get("/projects/{project_id}/folders")
def get_folders(project_id: str, db: Session = Depends(get_db)):
    folders = (
        db.query(
            func.split_part(Document.relative_path, PATH_SEP, 2).label("folder"),
            func.count(Document.document_id).label("count"),
        )
        .filter(func.split_part(Document.relative_path, PATH_SEP, 1) == project_id)
        .group_by("folder")
        .order_by("folder")
        .all()
    )

    return [{"id": f[0], "name": f[0], "count": f[1]} for f in folders]


# Returns every document in a project, regardless of subfolder. Used by the
# dashboard view, which matches documents to process-map boxes by exact name
# across the whole project rather than one folder at a time.
@app.get("/projects/{project_id}/documents")
def get_project_documents(project_id: str, db: Session = Depends(get_db)):
    docs = (
        db.query(Document)
        .filter(func.split_part(Document.relative_path, PATH_SEP, 1) == project_id)
        .all()
    )

    return [
        {
            "id": str(doc.document_id),
            "name": doc.doc_name,
            "extension": doc.extension_,
            "status": doc.status.status,
            "color": doc.status.color,
            "size": doc.size_,
            "modified_at": doc.data_zmiany_dokumentu.isoformat() if doc.data_zmiany_dokumentu else None,
        }
        for doc in docs
    ]


# NOTE: nested under /projects/{project_id}/... rather than the flat
# /folders/{folder_id}/documents from the mock-up. Folder names like "Inne"
# or "Elektryka" can repeat across different projects, so filtering on
# folder name alone could mix documents from two projects together.
# Scoping by both project_id and folder_id keeps each folder's documents
# correctly isolated.
@app.get("/projects/{project_id}/folders/{folder_id}/documents")
def get_documents(project_id: str, folder_id: str, db: Session = Depends(get_db)):
    docs = (
        db.query(Document)
        .filter(func.split_part(Document.relative_path, PATH_SEP, 1) == project_id)
        .filter(func.split_part(Document.relative_path, PATH_SEP, 2) == folder_id)
        .order_by(Document.doc_name)
        .all()
    )

    return [
        {
            "id": str(doc.document_id),
            "name": doc.doc_name,
            "extension": doc.extension_,
            "status": doc.status.status,
            "color": doc.status.color,
            "size": doc.size_,
            "modified_at": doc.data_zmiany_dokumentu.isoformat() if doc.data_zmiany_dokumentu else None,
        }
        for doc in docs
    ]


@app.get("/statuses")
def get_statuses(db: Session = Depends(get_db)):
    statuses = db.query(Status).order_by(Status.status_id).all()

    return [
        {"id": s.status_id, "name": s.status, "color": s.color} for s in statuses
    ]


@app.get("/documents/{document_id}")
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == document_id).first()

    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": str(doc.document_id),
        "name": doc.doc_name,
        "extension": doc.extension_,
        "relative_path": doc.relative_path,
        "absolute_path": doc.absolute_path,
        "size": doc.size_,
        "created_at": doc.data_utworzenia_dokumentu.isoformat() if doc.data_utworzenia_dokumentu else None,
        "modified_at": doc.data_zmiany_dokumentu.isoformat() if doc.data_zmiany_dokumentu else None,
        "hash": doc.hash,
        "source": doc.source_,
        "status_id": doc.status_id,
        "status": doc.status.status,
        "color": doc.status.color,
        "rola_osoby_odpowiedzialnej": doc.rola_osoby_odpowiedzialnej,
        "zatwierdzone": bool(doc.zatwierdzone),
        "zatwierdzil": user_display_name(doc.user),
        "data_waznosci": doc.data_waznosci.isoformat() if doc.data_waznosci else None,
        "status_modified_at": doc.data_modyfikacji_statusu_dokumentu.isoformat()
        if doc.data_modyfikacji_statusu_dokumentu
        else None,
    }


# Returns the archived history of a document - every prior state of its
# status/rola_osoby_odpowiedzialnej/zatwierdzone/data_waznosci, each with
# the time window it was valid for. Populated by the archive_document_version
# trigger, not by application code - the app only ever writes the current
# row in `documents`.
@app.get("/documents/{document_id}/versions")
def get_document_versions(document_id: str, db: Session = Depends(get_db)):
    versions = (
        db.query(DocumentVersion)
        .filter(DocumentVersion.document_id == document_id)
        .order_by(DocumentVersion.start_dt.desc())
        .all()
    )

    return [
        {
            "id": str(v.version_id),
            "status": v.status.status,
            "color": v.status.color,
            "rola_osoby_odpowiedzialnej": v.rola_osoby_odpowiedzialnej,
            "zatwierdzone": bool(v.zatwierdzone),
            "zatwierdzil": user_display_name(v.user),
            "data_waznosci": v.data_waznosci.isoformat() if v.data_waznosci else None,
            "start_dt": v.start_dt.isoformat() if v.start_dt else None,
            "end_dt": v.end_dt.isoformat() if v.end_dt else None,
        }
        for v in versions
    ]


@app.post("/documents/{document_id}/open")
def open_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == document_id).first()

    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    if not doc.absolute_path:
        raise HTTPException(status_code=400, detail="Document has no absolute path")

    try:
        if sys.platform == "win32":
            os.startfile(doc.absolute_path)
        elif sys.platform == "darwin":
            subprocess.run(["open", doc.absolute_path], check=True)
        else:
            subprocess.run(["xdg-open", doc.absolute_path], check=True)
    except OSError as exc:
        raise HTTPException(
            status_code=500, detail=f"Nie udało się otworzyć pliku: {exc}"
        )

    return {"opened": True}


class DocumentUpdate(BaseModel):
    status_id: int | None = None
    rola_osoby_odpowiedzialnej: str | None = None
    zatwierdzone: bool | None = None
    data_waznosci: date | None = None


@app.patch("/documents/{document_id}")
def update_document(
    document_id: str,
    payload: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()

    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    # exclude_unset means a field genuinely absent from the request body is
    # left untouched, while a field explicitly sent as `null` (e.g. marking
    # data_waznosci "nie dotyczy") really does clear it to NULL.
    updates = payload.model_dump(exclude_unset=True)

    if "zatwierdzone" in updates:
        updates["zatwierdzone"] = int(updates["zatwierdzone"])

    for field, value in updates.items():
        setattr(doc, field, value)

    # Who made this change is never taken from the client - it's always the
    # authenticated session, and only stamped when something actually
    # changed (an empty PATCH shouldn't touch user_id or fire the
    # archive/modification triggers).
    if updates:
        doc.user_id = current_user.user_id

    db.commit()
    db.refresh(doc)

    return {
        "id": str(doc.document_id),
        "name": doc.doc_name,
        "status_id": doc.status_id,
        "status": doc.status.status,
        "color": doc.status.color,
        "rola_osoby_odpowiedzialnej": doc.rola_osoby_odpowiedzialnej,
        "zatwierdzone": bool(doc.zatwierdzone),
        "zatwierdzil": user_display_name(doc.user),
        "data_waznosci": doc.data_waznosci.isoformat() if doc.data_waznosci else None,
        "status_modified_at": doc.data_modyfikacji_statusu_dokumentu.isoformat()
        if doc.data_modyfikacji_statusu_dokumentu
        else None,
    }