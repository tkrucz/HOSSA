from synchronizer.document import Document

# When a document already exists and is re-synced (i.e. the file is still there), its status auto-advances from "brak" to this value - but only from "brak".
# Any other status (including this one) means an employee has already started working with it, so re-syncing must never touch it again.
AUTO_ADVANCE_FROM = "brak"
AUTO_ADVANCE_TO = "w trakcie przygotowania"


# Handles persistence of scanned documents into the PostgreSQL database.
class DocumentRepository:

    def __init__(self, database):
        self.connection = database.get_connection()

    def save(self, document: Document):
        cursor = self.connection.cursor()

        query = """
                INSERT INTO documents
                (doc_name, \
                 extension_, \
                 absolute_path, \
                 relative_path, \
                 size_, \
                 data_utworzenia_dokumentu, \
                 data_zmiany_dokumentu, \
                 hash, \
                 source_)

                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT(relative_path)
        DO \
                UPDATE SET \
                    hash = EXCLUDED.hash, \
                    size_ = EXCLUDED.size_, \
                    data_utworzenia_dokumentu = EXCLUDED.data_utworzenia_dokumentu, \
                    data_zmiany_dokumentu = EXCLUDED.data_zmiany_dokumentu, \
                    source_ = EXCLUDED.source_, \
                    status_id = CASE \
                    WHEN documents.status_id = (SELECT status_id FROM status WHERE status = %s) \
                    THEN (SELECT status_id FROM status WHERE status = %s) \
                    ELSE documents.status_id
                END \
                """
        # A brand new file has no `documents` row yet, so it takes the table's own DEFAULT (status_id 1 / "brak") - nothing to set here.
        # Only the ON CONFLICT branch (the file already existed and is being re-synced) auto-advances "brak" -> "w trakcie przygotowania",
        # and only when it's still exactly "brak". Any status an employee picked manually is preserved on every future sync.

        cursor.execute(
            query,
            (
                document.name,
                document.extension,
                document.absolute_path,
                document.relative_path,
                document.size,
                document.created,
                document.modified,
                document.hash,
                document.source,
                AUTO_ADVANCE_FROM,
                AUTO_ADVANCE_TO,
            )
        )

        self.connection.commit()

        cursor.close()
