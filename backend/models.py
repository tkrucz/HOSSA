from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.database import engine
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Status(Base):
    __tablename__ = "status"

    status_id = Column(Integer, primary_key=True)
    status = Column(String)
    color = Column(String)


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String)
    user_surname = Column(String)
    login = Column(String)
    password = Column(String)  # always a bcrypt hash - see backend/auth.py


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
    zatwierdzone = Column(Integer)  # 0 = not approved, 1 = approved
    user_id = Column(Integer, ForeignKey("users.user_id"))
    data_waznosci = Column(Date)
    start_dt = Column(DateTime)
    end_dt = Column(DateTime)
    data_modyfikacji_statusu_dokumentu = Column(DateTime)

    status = relationship("Status")
    user = relationship("User")


class DocumentVersion(Base):
    __tablename__ = "document_versions"

    version_id = Column(UUID, primary_key=True)
    document_id = Column(UUID, ForeignKey("documents.document_id"))
    status_id = Column(Integer, ForeignKey("status.status_id"))

    rola_osoby_odpowiedzialnej = Column(String)
    zatwierdzone = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    data_waznosci = Column(Date)
    start_dt = Column(DateTime)
    end_dt = Column(DateTime)

    status = relationship("Status")
    user = relationship("User")