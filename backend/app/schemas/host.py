# backend/app/schemas/host.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Node schemas
class NodeBase(BaseModel):
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

class NodeCreate(NodeBase):
    cluster_id: int

class NodeUpdate(BaseModel):
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

class Node(NodeBase):
    id: int
    cluster_id: int
    ssh_reachable: bool
    is_alive: bool
    passing_unit_tests: bool
    last_health_check: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Cluster schemas
class ClusterBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClusterCreate(ClusterBase):
    pass

class Cluster(ClusterBase):
    id: int
    created_at: datetime
    updated_at: datetime
    nodes: List[Node] = []

    class Config:
        from_attributes = True


