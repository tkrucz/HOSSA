from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base


Base = declarative_base()

# Database model representing available document statuses together with their associated display colors.
class Status(Base):
    __tablename__ = "status"

    status_id = Column(Integer, primary_key=True)
    status = Column(String)
    color = Column(String)


# ORM model representing document metadata stored in the database and linked to a document status.
class Document(Base):
    __tablename__ = "documents"

    document_id = Column(UUID, primary_key=True)
    status_id = Column(Integer, ForeignKey("status.status_id"))

    doc_name = Column(String)
    extension_ = Column(String)
    absolute_path = Column(String)
    relative_path = Column(String)
    size_ = Column(BigInteger)
    data_utworzenia_dokumentu = Column(Date)
    data_zmiany_dokumentu = Column(DateTime)
    hash = Column(String)
    source_ = Column(String)
    rola_osoby_odpowiedzialnej = Column(String)
    kto_zatwierdzil = Column(String)
    data_waznosci = Column(Date)
    data_modyfikacji_statusu_dokumentu = Column(DateTime)

    # Establishes the relationship allowing direct access to status information from a document instance.
    status = relationship("Status")