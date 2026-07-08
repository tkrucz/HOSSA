from synchronizer.data_loader import DataLoader
from backend.database import Database
from synchronizer.repository import DocumentRepository


folder = r"C:\Users\tomek\Desktop\Dane"

# Initializes the filesystem scanner for the configured document directory.
loader = DataLoader(folder)
documents = loader.scan()
db = Database()
repository = DocumentRepository(db)

# Persists each discovered document into the database inserting new records or updating existing ones.
for document in documents:
    repository.save(document)


print(f"Zapisano {len(documents)} dokumentów")