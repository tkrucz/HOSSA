from pydantic import BaseModel

# Response schema used to serialize document data returned by API endpoints.
class DocumentResponse(BaseModel):
    document_id: str
    doc_name: str
    status: str
    color: str


    class Config:
        from_attributes = True