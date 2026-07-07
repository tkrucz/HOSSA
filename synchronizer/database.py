import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = (
    "postgresql://postgres:haslo123@localhost:5431/documents"
)


engine = create_engine(
    DATABASE_URL
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

class Database:

    def __init__(
        self,
        host="localhost",
        port=5431,
        database="documents",
        user="postgres",
        password="haslo123"
    ):
        self.connection = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )


    def get_connection(self):
        return self.connection