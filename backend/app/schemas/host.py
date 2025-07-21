# backend/app/schemas/host.py
from pydantic import BaseModel
from datetime import datetime

class HostBase(BaseModel):
    name: str
    address: str

class HostCreate(HostBase):
    pass

class Host(HostBase):
    id: int
    created_at: datetime
    alive: bool               # new
    passingTests: bool        # new

    class Config:
        from_attributes = True

