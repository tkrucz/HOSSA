import uuid

from synchronizer.document import Document

# When a document already exists and is re-synced (i.e. the file is still there), its status auto-advances from "brak" to "w trakcie przygotowania".
# Any other status (including this one) means an employee has already started working with it, so re-syncing must never touch it again.
AUTO_ADVANCE_FROM = "brak"
AUTO_ADVANCE_TO = "w trakcie przygotowania"

# Placeholder account (seeded by the DDL) used as user_id for documents
# inserted by this sync job, which has no logged-in person behind it.
SYSTEM_USER_LOGIN = "system"


# Handles persistence of scanned documents into the SQLite database.
class DocumentRepository:

    def __init__(self, database):
        self.connection = database.get_connection()
        self.system_user_id = self._get_system_user_id()

    def _get_system_user_id(self):
        cursor = self.connection.cursor()
        cursor.execute(
            "SELECT user_id FROM users WHERE login = ?", (SYSTEM_USER_LOGIN,)
        )
        row = cursor.fetchone()
        cursor.close()

        if row is None:
            raise RuntimeError(
                f"No user with login '{SYSTEM_USER_LOGIN}' found - run the "
                "users seed insert from the schema before syncing."
            )

        return row[0]

    def save(self, document: Document):

        cursor = self.connection.cursor()

        # SQLite has no gen_random_uuid() server-side default (unlike
        # Postgres) - this id is only actually used if this turns out to be
        # a brand-new row; on conflict/update it's simply discarded, since
        # `document_id` is never part of the ON CONFLICT ... DO UPDATE SET
        # list below (an existing row's own id is never overwritten).
        new_document_id = str(uuid.uuid4())

        query = """
        INSERT INTO documents
        (
            document_id,
            doc_name,
            extension_,
            absolute_path,
            relative_path,
            size_,
            data_utworzenia_dokumentu,
            data_zmiany_dokumentu,
            hash,
            source_,
            user_id
        )

        VALUES
        (
            ?,?,?,?,?,?,?,?,?,?,?
        )

        ON CONFLICT(relative_path)
        DO UPDATE SET

        hash = excluded.hash,
        size_ = excluded.size_,
        data_utworzenia_dokumentu = excluded.data_utworzenia_dokumentu,
        data_zmiany_dokumentu = excluded.data_zmiany_dokumentu,
        source_ = excluded.source_,
        status_id = CASE
            WHEN documents.status_id = (SELECT status_id FROM status WHERE status = ?)
            THEN (SELECT status_id FROM status WHERE status = ?)
            ELSE documents.status_id
        END
        """
        # A brand new file has no `documents` row yet, so it takes the table's own DEFAULT (status_id 1 / "brak") - nothing to set here.
        # Only the ON CONFLICT branch (the file already existed and is being re-synced) auto-advances "brak" -> "w trakcie przygotowania",
        # and only when it's still exactly "brak". Any status an employee picked manually is preserved on every future sync.

        # user_id is intentionally absent from DO UPDATE SET - re-syncing must never overwrite who a human last set on this document;
        # only a brand-new row gets user_id = the "system" placeholder account.

        cursor.execute(
            query,
            (
                new_document_id,
                document.name,
                document.extension,
                document.absolute_path,
                document.relative_path,
                document.size,
                document.created,
                document.modified,
                document.hash,
                document.source,
                self.system_user_id,
                AUTO_ADVANCE_FROM,
                AUTO_ADVANCE_TO,
            )
        )

        self.connection.commit()

        cursor.close()