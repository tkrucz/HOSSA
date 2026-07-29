from synchronizer.document import Document

# When a document already exists and is re-synced (i.e. the file is still there), its status auto-advances from "brak" to "w trakcie przygotowania".
# Any other status (including this one) means an employee has already started working with it, so re-syncing must never touch it again.
AUTO_ADVANCE_FROM = "brak"
AUTO_ADVANCE_TO = "w trakcie przygotowania"

# Placeholder account (seeded by the DDL) used as user_id for documents
# inserted by this sync job, which has no logged-in person behind it.
SYSTEM_USER_LOGIN = "system"


# Handles persistence of scanned documents into the PostgreSQL database.
class DocumentRepository:

    def __init__(self, database):
        self.connection = database.get_connection()
        self.system_user_id = self._get_system_user_id()

    def _get_system_user_id(self):
        cursor = self.connection.cursor()
        cursor.execute(
            "SELECT user_id FROM users WHERE login = %s", (SYSTEM_USER_LOGIN,)
        )
        row = cursor.fetchone()
        cursor.close()

        if row is None:
            raise RuntimeError(
                f"No user with login '{SYSTEM_USER_LOGIN}' found - run the "
                "users seed insert from the DDL before syncing."
            )

        return row[0]

    def save(self, document: Document):

        cursor = self.connection.cursor()

        query = """
        INSERT INTO documents
        (
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
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s
        )

        ON CONFLICT(relative_path)
        DO UPDATE SET

        hash = EXCLUDED.hash,
        size_ = EXCLUDED.size_,
        data_utworzenia_dokumentu = EXCLUDED.data_utworzenia_dokumentu,
        data_zmiany_dokumentu = EXCLUDED.data_zmiany_dokumentu,
        source_ = EXCLUDED.source_,
        status_id = CASE
            WHEN documents.status_id = (SELECT status_id FROM status WHERE status = %s)
            THEN (SELECT status_id FROM status WHERE status = %s)
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