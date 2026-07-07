from document import Document


class DocumentRepository:


    def __init__(self, database):
        self.connection = database.get_connection()


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
            created_at,
            modified_at,
            hash,
            source_
        )

        VALUES
        (
            %s,%s,%s,%s,%s,%s,%s,%s,%s
        )

        ON CONFLICT(relative_path)
        DO UPDATE SET

        hash = EXCLUDED.hash,
        size_ = EXCLUDED.size_,
        created_at = EXCLUDED.created_at,
        modified_at = EXCLUDED.modified_at,
        source_ = EXCLUDED.source_
        """


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
                document.source
            )
        )


        self.connection.commit()

        cursor.close()