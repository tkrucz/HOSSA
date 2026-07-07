from utilities.data_loader import DataLoader
from db.database import Database
from db.repository import DocumentRepository


folder = r"C:\Users\tomek\Desktop\Dane"

loader = DataLoader(folder)

documents = loader.scan()

print(documents[0])


db = Database()

repository = DocumentRepository(db)


for document in documents:
    repository.save(document)


print(
    f"Zapisano {len(documents)} dokumentów"
)

#  C:\Users\tomek\.local\bin\claude.exe