import psycopg2


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