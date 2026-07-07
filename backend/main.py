from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from synchronizer.database import SessionLocal
from backend.models import Document, Status

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
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