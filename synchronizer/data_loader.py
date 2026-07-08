from pathlib import Path
from synchronizer.document import Document
from synchronizer.document import calculate_hash
from datetime import datetime


# Scans the configured directory recursively and builds document objects containing filesystem metadata.
class DataLoader:
    def __init__(self, root_path: str):
        self.root = Path(root_path)

    def scan(self) -> list[Document]:
        documents = []

        # Searches recursively for all files within the configured root directory.
        for file in self.root.rglob("*"):
            if not file.is_file():
                continue

            stat = file.stat()
            documents.append(
                Document(
                    name=file.stem,
                    extension=file.suffix,
                    source=str(file.resolve()),
                    relative_path=str(file.relative_to(self.root)),
                    absolute_path=str(file.resolve()),
                    size=stat.st_size,
                    created=datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                    modified=datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    hash=calculate_hash(file)  # Calculates a SHA-256 hash to uniquely identify file contents and detect modifications.
                )
            )
        return documents