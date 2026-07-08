from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from sqlalchemy import func
from sqlalchemy.orm import Session

from synchronizer.database import SessionLocal

from backend.models import Document, Status

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


@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db)
):

    result = (
        db.query(
            Document,
            Status
        )
        .join(
            Status,
            Document.status_id == Status.status_id
        )
        .all()
    )


    return [
        {
            "document_id": str(doc.document_id),
            "doc_name": doc.doc_name,
            "status": status.status,
            "color": status.color
        }

        for doc,status in result
    ]


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
            "status": doc.status.status,
            "color": doc.status.color,
            "size": doc.size_,
            "modified_at": doc.modified_at.isoformat() if doc.modified_at else None,
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
        "created_at": doc.created_at.isoformat() if doc.created_at else None,
        "modified_at": doc.modified_at.isoformat() if doc.modified_at else None,
        "hash": doc.hash,
        "source": doc.source_,
        "status_id": doc.status_id,
        "status": doc.status.status,
        "color": doc.status.color,
        "rola_osoby_odpowiedzialnej": doc.rola_osoby_odpowiedzialnej,
        "kto_zatwierdzil": doc.kto_zatwierdzil,
    }


class DocumentUpdate(BaseModel):
    status_id: int | None = None
    rola_osoby_odpowiedzialnej: str | None = None
    kto_zatwierdzil: str | None = None


@app.patch("/documents/{document_id}")
def update_document(
        document_id: str, payload: DocumentUpdate, db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()

    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    if payload.status_id is not None:
        doc.status_id = payload.status_id
    if payload.rola_osoby_odpowiedzialnej is not None:
        doc.rola_osoby_odpowiedzialnej = payload.rola_osoby_odpowiedzialnej
    if payload.kto_zatwierdzil is not None:
        doc.kto_zatwierdzil = payload.kto_zatwierdzil

    db.commit()
    db.refresh(doc)

    return {
        "id": str(doc.document_id),
        "name": doc.doc_name,
        "status_id": doc.status_id,
        "status": doc.status.status,
        "color": doc.status.color,
        "rola_osoby_odpowiedzialnej": doc.rola_osoby_odpowiedzialnej,
        "kto_zatwierdzil": doc.kto_zatwierdzil,
    }

