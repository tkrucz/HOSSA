from pathlib import Path
from synchronizer.document import Document
from synchronizer.document import calculate_hash
from datetime import datetime

class DataLoader:

    def __init__(self, root_path: str):
        self.root = Path(root_path)

    def scan(self) -> list[Document]:

        documents = []

        for pdf in self.root.rglob("*.pdf"):

            stat = pdf.stat()

            documents.append(
                Document(
                    name=pdf.stem,
                    extension=pdf.suffix,
                    source=str(pdf.resolve()),
                    relative_path=str(pdf.relative_to(self.root)),
                    absolute_path=str(pdf.resolve()),
                    size=stat.st_size,
                    created=datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                    modified=datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    hash=calculate_hash(pdf)
                )
            )

        return documents