from pydantic import BaseModel


class DocumentResponse(BaseModel):
    document_id: str
    doc_name: str
    status: str
    color: str


    class Config:
        from_attributes = True