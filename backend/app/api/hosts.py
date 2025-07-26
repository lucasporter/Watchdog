# backend/app/api/hosts.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.schemas.host import System, SystemCreate, SystemUpdate, Machine, MachineCreate, MachineUpdate
from app.models.host import System as SystemModel, Machine as MachineModel
from app.db.session import get_db
from app.utils.health import is_alive

router = APIRouter()

# System endpoints
@router.get("/systems", response_model=List[System])
def list_systems(db: Session = Depends(get_db)):
    """Fetch all systems with their machines."""
    return db.query(SystemModel).all()

@router.post("/systems", response_model=System, status_code=status.HTTP_201_CREATED)
def create_system(system: SystemCreate, db: Session = Depends(get_db)):
    """Create a new system."""
    db_system = SystemModel(**system.dict())
    db.add(db_system)
    db.commit()
    db.refresh(db_system)
    return db_system

@router.get("/systems/{system_id}", response_model=System)
def get_system(system_id: int, db: Session = Depends(get_db)):
    """Get a specific system by ID."""
    system = db.query(SystemModel).filter(SystemModel.id == system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="System not found")
    return system

@router.put("/systems/{system_id}", response_model=System)
def update_system(system_id: int, system_update: SystemUpdate, db: Session = Depends(get_db)):
    """Update a system."""
    db_system = db.query(SystemModel).filter(SystemModel.id == system_id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="System not found")
    
    update_data = system_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_system, field, value)
    
    db_system.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_system)
    return db_system

@router.delete("/systems/{system_id}")
def delete_system(system_id: int, db: Session = Depends(get_db)):
    """Delete a system and all its machines."""
    db_system = db.query(SystemModel).filter(SystemModel.id == system_id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="System not found")
    
    db.delete(db_system)
    db.commit()
    return {"message": "System deleted successfully"}

# Machine endpoints
@router.get("/machines", response_model=List[Machine])
def list_machines(db: Session = Depends(get_db)):
    """Fetch all machines with their current health status."""
    machines = db.query(MachineModel).all()
    results = []
    for machine in machines:
        # Update health status
        machine.is_alive = is_alive(machine.ip_address, machine.ssh_port)
        machine.last_health_check = datetime.utcnow()
        
        # TODO: Add actual unit test checking logic here
        # For now, default to True
        machine.passing_unit_tests = True
        
        results.append(machine)
    
    db.commit()
    return results

@router.get("/systems/{system_id}/machines", response_model=List[Machine])
def list_system_machines(system_id: int, db: Session = Depends(get_db)):
    """Fetch all machines for a specific system."""
    system = db.query(SystemModel).filter(SystemModel.id == system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="System not found")
    
    machines = db.query(MachineModel).filter(MachineModel.system_id == system_id).all()
    results = []
    for machine in machines:
        # Update health status
        machine.is_alive = is_alive(machine.ip_address, machine.ssh_port)
        machine.last_health_check = datetime.utcnow()
        
        # TODO: Add actual unit test checking logic here
        # For now, default to True
        machine.passing_unit_tests = True
        
        results.append(machine)
    
    db.commit()
    return results

@router.post("/machines", response_model=Machine, status_code=status.HTTP_201_CREATED)
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    """Create a new machine."""
    # Verify system exists
    system = db.query(SystemModel).filter(SystemModel.id == machine.system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="System not found")
    
    db_machine = MachineModel(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine

@router.get("/machines/{machine_id}", response_model=Machine)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    """Get a specific machine by ID."""
    machine = db.query(MachineModel).filter(MachineModel.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.put("/machines/{machine_id}", response_model=Machine)
def update_machine(machine_id: int, machine_update: MachineUpdate, db: Session = Depends(get_db)):
    """Update a machine."""
    db_machine = db.query(MachineModel).filter(MachineModel.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    update_data = machine_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_machine, field, value)
    
    db_machine.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_machine)
    return db_machine

@router.delete("/machines/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    """Delete a machine."""
    db_machine = db.query(MachineModel).filter(MachineModel.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    db.delete(db_machine)
    db.commit()
    return {"message": "Machine deleted successfully"}

# Legacy endpoint for backward compatibility
@router.get("/hosts", response_model=List[Machine])
def list_hosts(db: Session = Depends(get_db)):
    """Legacy endpoint - returns all machines as hosts."""
    return list_machines(db)

