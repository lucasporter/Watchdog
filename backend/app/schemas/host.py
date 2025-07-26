# backend/app/schemas/host.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Machine schemas
class MachineBase(BaseModel):
    name: str
    ip_address: str
    hostname: Optional[str] = None
    ssh_port: int = 22
    ssh_username: Optional[str] = None
    ssh_key_path: Optional[str] = None
    operating_system: Optional[str] = None
    cpu_info: Optional[str] = None
    memory_info: Optional[str] = None
    disk_info: Optional[str] = None
    notes: Optional[str] = None

class MachineCreate(MachineBase):
    system_id: int

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    ssh_port: Optional[int] = None
    ssh_username: Optional[str] = None
    ssh_key_path: Optional[str] = None
    operating_system: Optional[str] = None
    cpu_info: Optional[str] = None
    memory_info: Optional[str] = None
    disk_info: Optional[str] = None
    notes: Optional[str] = None

class Machine(MachineBase):
    id: int
    system_id: int
    ssh_reachable: bool
    is_alive: bool
    passing_unit_tests: bool
    last_health_check: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# System schemas
class SystemBase(BaseModel):
    name: str
    description: Optional[str] = None

class SystemCreate(SystemBase):
    pass

class SystemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class System(SystemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    machines: List[Machine] = []

    class Config:
        from_attributes = True

# Legacy Host schema for backward compatibility (if needed)
class Host(BaseModel):
    id: int
    name: str
    address: str
    created_at: datetime
    alive: bool
    passingTests: bool

    class Config:
        from_attributes = True


