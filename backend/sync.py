from synchronizer.data_loader import DataLoader
from backend.database import SessionLocal
from backend.database import Database
from backend.models import Document
from synchronizer.repository import DocumentRepository

# TODO: move this to a config file / environment variable instead of hardcoding
DOCUMENTS_FOLDER = r"C:\Users\tomek\Desktop\Dane"


def sync_documents(folder: str = DOCUMENTS_FOLDER) -> dict:
    """Scans `folder` for documents, inserts/updates them in the database, and removes DB records for files that no longer exist on disk.
    Returns a dict with the counts of scanned and removed documents.
    """
    loader = DataLoader(folder)
    documents = loader.scan()

    db = Database()
    repository = DocumentRepository(db)

    for document in documents:
        repository.save(document)

    scanned_paths = {document.relative_path for document in documents}
    removed = _remove_stale_documents(scanned_paths)

    return {"synced": len(documents), "removed": removed}


def _remove_stale_documents(scanned_paths: set[str]) -> int:
    """Deletes documents whose relative_path is not in `scanned_paths`.
    If `scanned_paths` is empty (e.g. folder is empty or missing), every existing document is treated as stale and removed.
    """
    session = SessionLocal()

    try:
        query = session.query(Document)

        if scanned_paths:
            query = query.filter(Document.relative_path.notin_(scanned_paths))

        stale = query.all()

        for doc in stale:
            session.delete(doc)

        session.commit()

        return len(stale)
    finally:
        session.close()