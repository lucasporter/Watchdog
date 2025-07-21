# backend/app/api/scan.py
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.utils.scanner import scan_subnet

router = APIRouter(tags=["scan"])

class ScanRequest(BaseModel):
    prefix: str  # e.g. "10.0.2"
    # simple validation via regex in the endpoint

class ScanResult(BaseModel):
    address: str
    hostname: Optional[str]
    status: str  # "RED" | "BLUE" | "GREEN"

@router.post("/api/scan", response_model=List[ScanResult])
def scan(request: ScanRequest):
    # Validate format: three octets
    if not re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){2}", request.prefix):
        raise HTTPException(status_code=400, detail="Invalid subnet prefix")
    try:
        return scan_subnet(request.prefix)
    except Exception as e:
        raise HTTPException(500, f"Scan failed: {e}")

