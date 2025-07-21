# backend/app/main.py
from fastapi import FastAPI

app = FastAPI(
    title="Watchdog Monitoring API",
    version="0.1.0",
)

# a simple health check
@app.get("/health")
async def health():
    return {"status": "ok"}

# placeholder router includes (to import later)
# from .api import hosts, health
# app.include_router(hosts.router, prefix="/api/hosts", tags=["hosts"])
# app.include_router(health.router, prefix="/api/hosts/{host_id}", tags=["health"])

