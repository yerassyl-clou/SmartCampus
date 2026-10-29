from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartCampus API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "SmartCampus"}


@app.get("/api/deadlines")
def deadlines():
    raise HTTPException(status_code=501, detail="SIS89-03: deadlines endpoint is not implemented yet.")


@app.post("/api/chat")
def chat():
    raise HTTPException(status_code=501, detail="SIS89-06/07: grounded LLM chat is not implemented yet.")
