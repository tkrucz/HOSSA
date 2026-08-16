from sqlalchemy import func

from synchronizer.data_loader import DataLoader
from backend.config import DOCUMENTS_FOLDER, PATH_SEP
from backend.database import Database, SessionLocal
from backend.models import Document, Status, NotApplicableMarker
from synchronizer.repository import DocumentRepository


def sync_documents(folder: str = DOCUMENTS_FOLDER) -> dict:
    """Scans `folder` for documents, inserts/updates them in the database,
    removes DB records for files that no longer exist on disk, and resolves
    any "nie dotyczy" markers whose stage now has a real matching document.

    Returns a dict with the counts of scanned/removed/resolved documents.
    """
    loader = DataLoader(folder)
    documents = loader.scan()

    db = Database()
    repository = DocumentRepository(db)

    for document in documents:
        repository.save(document)

    scanned_paths = {document.relative_path for document in documents}
    removed = _remove_stale_documents(scanned_paths)
    resolved = _resolve_not_applicable_markers()

    return {"synced": len(documents), "removed": removed, "resolved": resolved}


def _remove_stale_documents(scanned_paths: set[str]) -> int:
    """Deletes documents whose relative_path is not in `scanned_paths`.

    If `scanned_paths` is empty (e.g. folder is empty or missing), every
    existing document is treated as stale and removed.
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


def _resolve_not_applicable_markers() -> int:
    """For every "nie dotyczy" marker, checks whether a real document now
    exists at that exact (project, folder, stage_name) scope. If so: the
    marker is deleted and that document's status is bumped straight to
    "w trakcie przygotowania" (skipping "brak" entirely - a marker existing
    means someone was already expecting this file to show up), but only if
    it's still at the default "brak" status, so a status a human already
    set manually is never overwritten.
    """
    session = SessionLocal()

    try:
        markers = session.query(NotApplicableMarker).all()
        if not markers:
            return 0

        brak = session.query(Status).filter(Status.status == "brak").first()
        w_trakcie = (
            session.query(Status)
            .filter(Status.status == "w trakcie przygotowania")
            .first()
        )

        resolved = 0

        for marker in markers:
            query = session.query(Document).filter(
                func.split_part(Document.relative_path, PATH_SEP, 1) == marker.project_id,
                Document.doc_name == marker.stage_name,
            )

            if marker.folder:
                query = query.filter(
                    func.split_part(Document.relative_path, PATH_SEP, 2) == marker.folder
                )

            doc = query.first()

            if doc is None:
                continue

            if brak is not None and doc.status_id == brak.status_id and w_trakcie is not None:
                doc.status_id = w_trakcie.status_id

            session.delete(marker)
            resolved += 1

        session.commit()

        return resolved
    finally:
        session.close()