from fastapi import FastAPI, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from synchronizer.database import SessionLocal
from backend.models import Document, Status

from fastapi.middleware.cors import CORSMiddleware

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
        db.query(Document, Status)
        .join(Status, Document.status_id == Status.status_id)
        .filter(func.split_part(Document.relative_path, PATH_SEP, 1) == project_id)
        .filter(func.split_part(Document.relative_path, PATH_SEP, 2) == folder_id)
        .order_by(Document.doc_name)
        .all()
    )

    return [
        {
            "id": str(doc.document_id),
            "name": doc.doc_name,
            "status": status.status,
            "color": status.color,
            "size": doc.size_,
            "modified_at": doc.modified_at.isoformat() if doc.modified_at else None,
        }
        for doc, status in docs
    ]
