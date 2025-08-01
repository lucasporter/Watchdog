# backend/app/models/host.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class System(Base):
    __tablename__ = "systems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to machines
    machines = relationship("Machine", back_populates="system", cascade="all, delete-orphan")

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    ip_address = Column(String, nullable=True, index=True)
    hostname = Column(String, nullable=True, index=True)
    
    # SSH connectivity
    ssh_reachable = Column(Boolean, default=False)
    ssh_port = Column(Integer, default=22)
    ssh_username = Column(String, nullable=True)
    ssh_key_path = Column(String, nullable=True)
    
    # Health status
    is_alive = Column(Boolean, default=False)
    passing_unit_tests = Column(Boolean, default=True)
    last_health_check = Column(DateTime, nullable=True)
    
    # Additional attributes
    operating_system = Column(String, nullable=True)
    cpu_info = Column(String, nullable=True)
    memory_info = Column(String, nullable=True)
    disk_info = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key to system
    system_id = Column(Integer, ForeignKey("systems.id"), nullable=False)
    system = relationship("System", back_populates="machines")

