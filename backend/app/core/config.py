# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/0"

    class Config:
        env_file = ".env"  # reads DATABASE_URL from backend/.env

settings = Settings()

