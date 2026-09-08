"""
Ollama Agent Service.
Proxy to local Ollama daemon — Legal Metrology compliance chat + vision analysis.
"""
import base64
import json
import logging
from typing import Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are the compliance assistant for India's Legal Metrology Compliance Architecture "
    "(SIH 2026, Problem Statement 034, Ministry of Consumer Affairs). "
    "You help citizens, shopkeepers, companies and government officials understand the "
    "Legal Metrology Act 2009 and the Packaged Commodities Rules 2011. "
    "Always cite the specific Rule number when relevant. Be concise and helpful."
)

REQUIRED_FIELDS = [
    "MRP (Maximum Retail Price)",
    "Net Quantity / Net Weight",
    "Manufacturer or Packer name and complete address",
    "Country of Origin",
    "Consumer care contact details",
    "Month and Year of Manufacture or Packing",
]


async def chat(message: str, history: Optional[list] = None) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history or [])
    messages.append({"role": "user", "content": message})
    async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
        try:
            resp = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/chat",
                json={"model": settings.OLLAMA_TEXT_MODEL, "messages": messages, "stream": False},
            )
            resp.raise_for_status()
            return resp.json().get("message", {}).get("content", "").strip()
        except httpx.ConnectError:
            raise RuntimeError(
                f"Cannot reach Ollama at {settings.OLLAMA_BASE_URL}. "
                "Make sure 'ollama serve' is running and llava is pulled."
            )
        except Exception as e:
            logger.error(f"Ollama chat error: {e}")
            raise RuntimeError(f"Ollama error: {e}")


async def analyze_label_image(image_path: str, required_fields: Optional[list] = None) -> dict:
    """Ask the vision model to check which mandatory fields are present/missing."""
    if required_fields is None:
        required_fields = REQUIRED_FIELDS
    with open(image_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode()
    prompt = (
        f"Look at this product package. Check for these mandatory fields: {', '.join(required_fields)}. "
        'Reply ONLY as JSON: {"present": ["..."], "missing": ["..."], "raw_notes": "short notes"}'
    )
    async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
        try:
            resp = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={"model": settings.OLLAMA_VISION_MODEL, "prompt": prompt,
                      "images": [img_b64], "stream": False, "format": "json"},
            )
            resp.raise_for_status()
            raw = resp.json().get("response", "{}")
            return json.loads(raw)
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            return {"present": [], "missing": required_fields, "raw_notes": str(e)}
