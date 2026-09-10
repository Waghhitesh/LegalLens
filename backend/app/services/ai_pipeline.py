"""
AI Pipeline Service.
Integrates YOLOv8 (crop), EasyOCR (text boxes), and Ollama/llava (structured extraction).
All models degrade gracefully if not installed.
Enhanced for accurate Indian product label detection.
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
    """Use Ollama llava to extract structured label data from product images."""
    from app.core.config import settings
    import httpx

    img_b64s = []
    for image_path in image_paths:
        with open(image_path, "rb") as f:
            img_b64s.append(base64.b64encode(f.read()).decode())

    prompt = (
        "You are an expert in reading Indian product packaging labels for Legal Metrology compliance. "
        "Carefully examine ALL text visible on this product package image. "
        "Look for these specific elements:\n"
        "- MRP: Look for '₹', 'Rs.', 'Rs', 'MRP', 'M.R.P', 'Maximum Retail Price' followed by a number\n"
        "- Net Weight/Quantity: Look for grams(g), kilograms(kg), millilitres(ml), litres(l/L), pieces(pcs)\n"
        "- Manufacturer: The company name, usually near 'Mfg by', 'Manufactured by', 'Packed by', 'Mfd. by'\n"
        "- Manufacturer Address: Full address of the manufacturer\n"
        "- Country of Origin: Usually 'Made in India', 'Product of India', 'Country of Origin: India'\n"
        "- Consumer Care: Look for 'Consumer Care', 'Customer Care', 'Helpline', toll-free numbers (1800-xxx), email addresses\n"
        "- Expiry Date: Look for 'Exp', 'Best Before', 'BB', 'Use By', 'Expiry'\n"
        "- Date of Manufacture: Look for 'Mfg Date', 'Mfd', 'DOM', 'Date of Manufacture', 'Pkg Date'\n"
        "- Batch/Lot Number: Look for 'Batch', 'Lot', 'B.No', 'L.No'\n"
        "- Product Name: The main product name, usually the largest text\n"
        "- Brand Name: The brand/company marketing the product\n"
        "- FSSAI License: Look for 'FSSAI', 'Lic No', 14-digit number starting with 1\n"
        "- Ingredients: List of ingredients if visible\n"
        "- Nutritional Info: Any nutritional values if visible\n\n"
        "Return ONLY a valid JSON object with these exact keys (use null if not found, don't guess):\n"
        '{"product_name": "<string or null>", "brand_name": "<string or null>", '
        '"mrp": <number or null>, "net_weight": "<string or null>", '
        '"manufacturer": "<string or null>", "manufacturer_address": "<string or null>", '
        '"country_of_origin": "<string or null>", '
        '"consumer_care": "<phone/email string or null>", '
        '"expiry_date": "<string or null>", "mfg_date": "<string or null>", '
        '"batch_number": "<string or null>", '
        '"fssai_license": "<string or null>", '
        '"ingredients": "<string or null>", '
        '"nutritional_info": "<string or null>"}'
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
        # Try to extract JSON from the response
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            logger.info(f"Ollama extracted: {json.dumps(parsed, indent=2)}")
            return parsed
    except Exception as e:
        logger.warning(f"Ollama extraction failed: {e}")
    return {}


def _extract_from_ocr_text(ocr_full_text: str) -> dict:
    """Robust regex-based extraction from OCR text as fallback or supplement."""
    extracted = {}
    text = ocr_full_text

    # MRP - multiple patterns for Indian products
    mrp_patterns = [
        r"(?:M\.?R\.?P\.?|Maximum\s*Retail\s*Price)\s*[:\s]*(?:Rs\.?|₹)\s*(\d[\d,]*\.?\d*)",
        r"(?:Rs\.?|₹)\s*(\d[\d,]*\.?\d*)\s*(?:incl|/-|only)",
        r"(?:M\.?R\.?P\.?)\s*[:\s]*(\d[\d,]*\.?\d*)",
        r"(?:Rs\.?|₹)\s*(\d[\d,]*\.?\d*)",
        r"MRP\s*(\d[\d,]*\.?\d*)",
    ]
    for pattern in mrp_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            try:
                extracted["mrp"] = float(m.group(1).replace(",", ""))
                break
            except ValueError:
                continue

    # Net Weight/Quantity
    weight_patterns = [
        r"(?:Net\s*(?:Weight|Wt|Qty|Quantity|Content)\s*[:\s]*)?(\d+\.?\d*\s*(?:kg|KG|Kg|g|gm|gms|GM|ml|ML|mL|Ml|l|L|ltr|Ltr|litre|Litre|pieces?|pcs))\b",
        r"(\d+\.?\d*\s*(?:kg|g|gm|ml|l|ltr|litre|pieces?|pcs))\b",
    ]
    for pattern in weight_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted["net_weight"] = m.group(1).strip()
            break

    # Manufacturer
    mfg_patterns = [
        r"(?:Mfg\.?\s*(?:by|By)|Manufactured\s*(?:by|By)|Packed\s*(?:by|By)|Mfd\.?\s*(?:by|By))\s*[:\s]*([A-Z][A-Za-z\s&.,]+?)(?:\n|,\s*(?:Plot|Add|Addr|Village|Survey))",
        r"(?:Mfg\.?\s*(?:by|By)|Manufactured\s*(?:by|By)|Packed\s*(?:by|By))\s*[:\s]*(.+?)(?:\n|$)",
    ]
    for pattern in mfg_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            mfg = m.group(1).strip()
            if len(mfg) > 3:  # Avoid noise
                extracted["manufacturer"] = mfg
                break

    # Country of Origin
    if re.search(r"(?:Made\s*in|Product\s*of|Country\s*of\s*Origin\s*[:\s]*)\s*India", text, re.IGNORECASE):
        extracted["country_of_origin"] = "India"
    elif re.search(r"Country\s*of\s*Origin\s*[:\s]*([A-Z][A-Za-z\s]+)", text, re.IGNORECASE):
        m = re.search(r"Country\s*of\s*Origin\s*[:\s]*([A-Z][A-Za-z\s]+)", text, re.IGNORECASE)
        extracted["country_of_origin"] = m.group(1).strip()

    # Consumer Care - phone numbers
    care_patterns = [
        r"(?:Consumer\s*Care|Customer\s*Care|Helpline|Toll\s*Free)\s*[:\s]*(\+?[\d\s-]{8,})",
        r"(1800[\s-]?\d{2,4}[\s-]?\d{2,4}[\s-]?\d{0,4})",
        r"(?:Ph|Phone|Tel|Contact)\s*[:\s]*(\+?91[\s-]?\d{5,}[\s-]?\d*)",
    ]
    for pattern in care_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted["consumer_care"] = m.group(1).strip()
            break

    # Consumer Care - email
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    if email_match:
        if "consumer_care" in extracted:
            extracted["consumer_care"] += ", " + email_match.group()
        else:
            extracted["consumer_care"] = email_match.group()

    # Expiry Date
    exp_patterns = [
        r"(?:Exp(?:iry)?\.?\s*(?:Date)?|Best\s*Before|BB|Use\s*By)\s*[:\s]*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})",
        r"(?:Exp(?:iry)?\.?\s*(?:Date)?|Best\s*Before|BB)\s*[:\s]*(\d{1,2}\s*(?:months?|yrs?|years?)\s*(?:from\s*(?:mfg|packaging|manufacture))?)",
        r"(?:Exp(?:iry)?\.?\s*(?:Date)?|Best\s*Before)\s*[:\s]*([A-Z][a-z]{2}\s*\d{2,4})",
    ]
    for pattern in exp_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted["expiry_date"] = m.group(1).strip()
            break

    # Manufacturing Date
    mfg_date_patterns = [
        r"(?:Mfg\.?\s*(?:Date|Dt)|Mfd\.?\s*(?:Date|Dt)?|DOM|Date\s*of\s*(?:Mfg|Manufacture)|Pkg\.?\s*(?:Date|Dt))\s*[:\s]*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})",
        r"(?:Mfg\.?\s*(?:Date|Dt)|Mfd\.?\s*Dt)\s*[:\s]*([A-Z][a-z]{2}\s*\d{2,4})",
    ]
    for pattern in mfg_date_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted["mfg_date"] = m.group(1).strip()
            break

    # Batch Number
    batch_patterns = [
        r"(?:Batch|Lot|B\.?\s*No|L\.?\s*No)\s*[:\s#]*([A-Z0-9][A-Z0-9/-]+)",
    ]
    for pattern in batch_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted["batch_number"] = m.group(1).strip()
            break

    # FSSAI License
    fssai_match = re.search(r"(?:FSSAI|Lic\.?\s*No\.?|License\s*No\.?)\s*[:\s]*(\d{14})", text, re.IGNORECASE)
    if not fssai_match:
        fssai_match = re.search(r"\b(1\d{13})\b", text)  # 14-digit number starting with 1
    if fssai_match:
        extracted["fssai_license"] = fssai_match.group(1)

    return extracted


def extract_label_data(image_paths: list[str]) -> dict:
    """
    Run OCR for bounding boxes + Ollama for structured JSON extraction.
    Supplements Ollama results with OCR regex fallback for missed fields.
    """
    # 1. OCR for bounding boxes and full text
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
                    elif any(u in t for u in ["net", "weight", "qty"]) and "net_weight" not in field_bounding_boxes:
                        field_bounding_boxes["net_weight"] = box
                    elif ("india" in t or "origin" in t) and "country_of_origin" not in field_bounding_boxes:
                        field_bounding_boxes["country_of_origin"] = box
                    elif ("mfg" in t or "manufactured" in t or "packed by" in t) and "manufacturer" not in field_bounding_boxes:
                        field_bounding_boxes["manufacturer"] = box
                    elif ("consumer" in t or "customer" in t or "helpline" in t or "1800" in t) and "consumer_care" not in field_bounding_boxes:
                        field_bounding_boxes["consumer_care"] = box
                    elif ("exp" in t or "best before" in t or "use by" in t) and "expiry_date" not in field_bounding_boxes:
                        field_bounding_boxes["expiry_date"] = box
                    elif ("fssai" in t or "lic" in t) and "fssai" not in field_bounding_boxes:
                        field_bounding_boxes["fssai"] = box
        except Exception as e:
            logger.error(f"OCR failed: {e}")

    logger.info(f"OCR full text: {ocr_full_text[:500]}")

    # 2. Ollama vision extraction
    extracted = _ollama_extract(image_paths)

    # 3. OCR regex extraction as supplement
    ocr_extracted = _extract_from_ocr_text(ocr_full_text) if ocr_full_text else {}

    # 4. Merge: Ollama results take priority, OCR fills gaps
    for key in ["mrp", "net_weight", "manufacturer", "manufacturer_address",
                "country_of_origin", "consumer_care", "expiry_date", "mfg_date",
                "batch_number", "fssai_license", "product_name", "brand_name",
                "ingredients", "nutritional_info"]:
        if not extracted.get(key) and ocr_extracted.get(key):
            extracted[key] = ocr_extracted[key]

    extracted["field_bounding_boxes"] = field_bounding_boxes
    extracted["ocr_raw_text"] = ocr_full_text.strip()
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
