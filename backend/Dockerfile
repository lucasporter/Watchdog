# backend/Dockerfile
FROM python:3.12-slim

# set a working dir
WORKDIR /app

# install system deps (for psycopg2)
RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# copy and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app code
COPY app ./app
COPY alembic.ini .       # Alembic config at root of backend
COPY alembic ./alembic

# expose the FastAPI port
EXPOSE 8000

# default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

