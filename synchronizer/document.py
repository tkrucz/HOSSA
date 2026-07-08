from dataclasses import dataclass
from pathlib import Path
import hashlib
from uuid import UUID

# Represents document metadata collected during filesystem scanning before persistence.
@dataclass
class Document:
    name: str
    extension: str
    source: str
    relative_path: str
    absolute_path: str
    size: int
    created: str
    modified: str
    hash: str
    document_id: UUID | None = None

# Computes a SHA-256 checksum for change detection and synchronization purposes.
def calculate_hash(file_path: Path) -> str:
    sha = hashlib.sha256()

    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)

    return sha.hexdigest()