from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .db import DatabaseUnavailable
from fastapi.middleware.cors import CORSMiddleware

from .routes.chat import router as chat_router
from .routes.deadlines import router as deadlines_router

app = FastAPI(title="SmartCampus API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])
app.include_router(deadlines_router)
app.include_router(chat_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "SmartCampus"}


@app.exception_handler(DatabaseUnavailable)
async def database_unavailable(request: Request, error: DatabaseUnavailable):
    logging.getLogger(__name__).warning("course_data_failure category=database_unavailable")
    return JSONResponse(status_code=503, headers={"X-SmartCampus-Error": "database_unavailable"},
                        content={"detail": "Course data is unavailable. Please ask the project team to seed the database."})
