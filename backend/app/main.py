"""
FastAPI application entrypoint for LegalLens — SIH 2026 PS-034.
Run: python -m uvicorn app.main:app --port 8000 --reload
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import init_db
from app.routers import audit, dashboard, auth, users, agent, notifications

app = FastAPI(
    title="LegalLens — Automated Legal Metrology Compliance Architecture",
    description="SIH 2026, Problem Statement 034 — Ministry of Consumer Affairs, Government of India",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router)
app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(agent.router)
app.include_router(notifications.router)

# Serve uploaded images
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "version": "2.0.0"}


@app.get("/", tags=["root"])
def root():
    return {"message": "LegalLens API — SIH 2026 PS-034", "docs": "/docs"}
