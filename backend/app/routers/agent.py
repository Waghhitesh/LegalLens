"""
Agent Router — chat + image analysis proxy to local Ollama.
"""
import os
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.core.config import settings
from app.services import ollama_agent

router = APIRouter(prefix="/api/v1/agent", tags=["agent"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


@router.post("/chat")
async def agent_chat(payload: ChatRequest):
    try:
        reply = await ollama_agent.chat(
            payload.message, [m.model_dump() for m in payload.history]
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return {"reply": reply}


@router.post("/analyze-image")
async def analyze_image(image: UploadFile = File(...)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(image.filename or "")[1] or ".jpg"
    path = os.path.join(settings.UPLOAD_DIR, f"agent_{uuid.uuid4()}{ext}")
    content = await image.read()
    with open(path, "wb") as f:
        f.write(content)
    try:
        result = await ollama_agent.analyze_label_image(path)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    result["risk_free"] = len(result.get("missing", [])) == 0
    return result


@router.post("/analyze-bulk")
async def analyze_bulk(images: list[UploadFile] = File(...)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    results = []
    for image in images:
        ext = os.path.splitext(image.filename or "")[1] or ".jpg"
        path = os.path.join(settings.UPLOAD_DIR, f"agent_{uuid.uuid4()}{ext}")
        content = await image.read()
        with open(path, "wb") as f:
            f.write(content)
        try:
            result = await ollama_agent.analyze_label_image(path)
            result["risk_free"] = len(result.get("missing", [])) == 0
        except Exception as exc:
            result = {"error": str(exc)}
        result["filename"] = image.filename
        results.append(result)
    return {"results": results}
