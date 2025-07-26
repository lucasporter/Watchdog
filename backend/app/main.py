# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.hosts import router as hosts_router
from app.api.scan import router as scan_router

app = FastAPI(
    title="Watchdog Monitoring API",
    version="0.1.0",
)

# 1) List the origins your frontend will use:
origins = [
    "http://localhost:5173",   # Vite dev server
    # add other origins here as needed (e.g. production domain)
]

# 2) Add the CORS middleware _before_ you include any routers:
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] to allow all in dev
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],          # allow all headers
)

# 3) Include your routers
app.include_router(hosts_router, prefix="/api", tags=["systems", "machines", "hosts"])
app.include_router(scan_router)
