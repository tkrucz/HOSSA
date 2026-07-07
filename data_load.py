from synchronizer.data_loader import DataLoader
from synchronizer.database import Database
from synchronizer.repository import DocumentRepository


folder = r"C:\Users\tomek\Desktop\Dane"

loader = DataLoader(folder)
documents = loader.scan()
db = Database()
repository = DocumentRepository(db)


for document in documents:
    repository.save(document)


print(
    f"Zapisano {len(documents)} dokumentów"
)

#  C:\Users\tomek\.local\bin\claude.exe