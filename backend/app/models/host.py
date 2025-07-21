# backend/app/models/host.py
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base

class Host(Base):
    __tablename__ = "hosts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    address = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False)

