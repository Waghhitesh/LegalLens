"""
AI Pipeline Service.
Integrates YOLOv8 (crop), EasyOCR (text boxes), and Ollama/llava (structured extraction).
All models degrade gracefully if not installed.
"""
import base64
import json
import logging
import os
import re
from typing import Optional

logger = logging.getLogger(__name__)

# ── Optional AI imports ──────────────────────────────────────────────────────
try:
    from ultralytics import YOLO
    _yolo = YOLO("yolov8n.pt")
    YOLO_OK = True
except Exception as e:
    logger.warning(f"YOLOv8 not available: {e}")
    YOLO_OK = False
    _yolo = None

try:
    import easyocr
    _ocr = easyocr.Reader(["en"], gpu=False)
    OCR_OK = True
except Exception as e:
    logger.warning(f"EasyOCR not available: {e}")
    OCR_OK = False
    _ocr = None

try:
    import cv2
    CV2_OK = True
except Exception as e:
    logger.warning(f"OpenCV not available: {e}")
    CV2_OK = False


# ── No stub bounding boxes used ──────────────────────


def crop_pdp(image_path: str) -> str:
    """Crop the Principal Display Panel using YOLOv8. Falls back to passthrough."""
    if not YOLO_OK or not CV2_OK:
        return image_path
    try:
        results = _yolo(image_path, verbose=False)
        if results and len(results[0].boxes) > 0:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            largest = max(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))
            img = cv2.imread(image_path)
            x1, y1, x2, y2 = map(int, largest)
            cropped = img[y1:y2, x1:x2]
            name, ext = os.path.splitext(image_path)
            out = f"{name}_pdp{ext}"
            cv2.imwrite(out, cropped)
            return out
    except Exception as e:
        logger.error(f"YOLOv8 crop failed: {e}")
    return image_path


def _ollama_extract(image_paths: list[str]) -> dict:
    """Use Ollama llava to extract structured label data."""
    from app.core.config import settings
    import httpx

    img_b64s = []
    for image_path in image_paths:
        with open(image_path, "rb") as f:
            img_b64s.append(base64.b64encode(f.read()).decode())

    prompt = (
        "You are a Legal Metrology compliance expert. Look at this product package image. "
        "Look for MRP printed as ₹, Rs, MRP, etc. Extract ONLY the following fields and return ONLY a JSON object with no extra text:\n"
        '{"mrp": <number or null>, "net_weight": "<string or null>", '
        '"manufacturer": "<string or null>", "country_of_origin": "<string or null>", '
        '"consumer_care": "<string or null>", "expiry_date": "<string or null>"}'
    )

    try:
        resp = httpx.post(
            f"{settings.OLLAMA_BASE_URL}/api/generate",
            json={"model": settings.OLLAMA_VISION_MODEL, "prompt": prompt,
                  "images": img_b64s, "stream": False},
            timeout=settings.OLLAMA_TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
        raw = resp.json().get("response", "{}")
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        logger.warning(f"Ollama extraction failed: {e}")
    return {}


def extract_label_data(image_paths: list[str]) -> dict:
    """
    Run OCR for bounding boxes + Ollama for structured JSON extraction.
    Returns dict with mrp, net_weight, manufacturer, country_of_origin,
    consumer_care, expiry_date, field_bounding_boxes.
    """
    # 1. OCR for bounding boxes
    field_bounding_boxes = {}
    ocr_full_text = ""
    if OCR_OK:
        try:
            for image_path in image_paths:
                results = _ocr.readtext(image_path)
                for bbox, text, conf in results:
                    ocr_full_text += text + " "
                    xs = [p[0] for p in bbox]
                    ys = [p[1] for p in bbox]
                    box = {"x": int(min(xs)), "y": int(min(ys)),
                           "w": int(max(xs) - min(xs)), "h": int(max(ys) - min(ys))}
                    t = text.lower()
                    if ("mrp" in t or "₹" in t or "rs" in t) and "mrp" not in field_bounding_boxes:
                        field_bounding_boxes["mrp"] = box
                    elif any(u in t for u in ["g", "kg", "ml", "net"]) and "net_weight" not in field_bounding_boxes:
                        field_bounding_boxes["net_weight"] = box
                    elif "india" in t and "country_of_origin" not in field_bounding_boxes:
                        field_bounding_boxes["country_of_origin"] = box
        except Exception as e:
            logger.error(f"OCR failed: {e}")

    # 2. Ollama vision extraction
    extracted = _ollama_extract(image_paths)
    
    # 3. Post-processing regex fallback on OCR text if Ollama misses MRP or weight
    if extracted.get("mrp") is None and ocr_full_text:
        m = re.search(r"(?:MRP|₹|Rs\.?)\s*[:]?\s*([\d,]+(?:\.\d{1,2})?)", ocr_full_text, re.IGNORECASE)
        if m:
            extracted["mrp"] = float(m.group(1).replace(",", ""))
    
    if extracted.get("net_weight") is None and ocr_full_text:
        m = re.search(r"(\d+\.?\d*\s?(?:g|kg|ml|l|L|litre|liter|gram|grams))\b", ocr_full_text, re.IGNORECASE)
        if m:
            extracted["net_weight"] = m.group(1)

    extracted["field_bounding_boxes"] = field_bounding_boxes
    return extracted


def calculate_font_height(image_path: str, reference_width: float = 80.0) -> Optional[float]:
    """Estimate font height in mm using OCR bounding boxes."""
    if not OCR_OK:
        return None
    try:
        results = _ocr.readtext(image_path)
        if not results:
            return None
        import cv2 as _cv2
        img = _cv2.imread(image_path)
        if img is None:
            return None
        img_width_px = img.shape[1]
        px_per_mm = img_width_px / reference_width
        heights_mm = []
        for bbox, _, _ in results:
            ys = [p[1] for p in bbox]
            h_px = max(ys) - min(ys)
            heights_mm.append(h_px / px_per_mm)
        return round(min(heights_mm), 2) if heights_mm else None
    except Exception as e:
        logger.error(f"Font height calculation failed: {e}")
        return None
