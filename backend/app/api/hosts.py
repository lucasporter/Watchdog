# backend/app/api/hosts.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.schemas.host import Host, HostCreate
from app.models.host import Host as HostModel
from app.db.session import get_db
from app.utils.health import is_alive

router = APIRouter()

@router.get("", response_model=List[Host])
def list_hosts(db: Session = Depends(get_db)):
    """
    Fetch all hosts and include their current alive & passingTests status.
    """
    rows = db.query(HostModel).all()
    results = []
    for h in rows:
        alive = is_alive(h.address)
        # no tests defined yet => treat as passing
        passing = True
        results.append({
            "id": h.id,
            "name": h.name,
            "address": h.address,
            "created_at": h.created_at,
            "alive": alive,
            "passingTests": passing,
        })
    return results

@router.post("", response_model=Host, status_code=status.HTTP_201_CREATED)
def create_host(new: HostCreate, db: Session = Depends(get_db)):
    """
    Create a new host record.
    """
    db_host = HostModel(
        name=new.name,
        address=new.address,
        created_at=datetime.utcnow(),
    )
    db.add(db_host)
    db.commit()
    db.refresh(db_host)
    return {
        "id": db_host.id,
        "name": db_host.name,
        "address": db_host.address,
        "created_at": db_host.created_at,
        "alive": True,           # default until first ping
        "passingTests": True,    # default
    }

@router.delete("/{host_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_host(host_id: int, db: Session = Depends(get_db)):
    """
    Delete a host by ID.
    """
    db_host = db.get(HostModel, host_id)
    if not db_host:
        raise HTTPException(status_code=404, detail="Host not found")
    db.delete(db_host)
    db.commit()
    return

