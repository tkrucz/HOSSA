from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from synchronizer.database import engine
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Status(Base):

    __tablename__ = "status"

    status_id = Column(
        Integer,
        primary_key=True
    )

    status = Column(String)

    color = Column(String)



class Document(Base):

    __tablename__ = "documents"


    document_id = Column(
        UUID,
        primary_key=True
    )

    status_id = Column(
        Integer,
        ForeignKey("status.status_id")
    )

    doc_name = Column(String)

    extension_ = Column(String)

    relative_path = Column(String)

    size_ = Column(BigInteger)

    hash = Column(String)