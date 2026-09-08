"""
Reconciliation Service.
Implements Rule 6, Rule 7, and overcharging checks.
"""
from typing import Optional, List
import re

from app.core.config import settings
from app.models.violation import RuleType

MANDATORY_FIELDS = [
    ("physical_mrp", "MRP (Maximum Retail Price)"),
    ("physical_net_weight", "Net Weight / Net Quantity"),
    ("physical_manufacturer", "Manufacturer Name & Address"),
    ("physical_country_of_origin", "Country of Origin"),
    ("physical_consumer_care", "Consumer Care Details"),
]

SCORE_DEDUCTIONS = {
    RuleType.RULE_6_MANDATORY_DECLARATION: 15,
    RuleType.RULE_7_FONT_LEGIBILITY: 20,
    RuleType.OVERCHARGING: 35,
}


def _parse_weight_grams(weight_str: Optional[str]) -> Optional[float]:
    if not weight_str:
        return None
    m = re.match(r"([\d.]+)\s?(kg|g|l|ml|L)", weight_str.strip(), re.IGNORECASE)
    if not m:
        return None
    value, unit = float(m.group(1)), m.group(2).lower()
    return value * 1000 if unit in ("kg", "l") else value


def _min_font_height(net_weight_str: Optional[str]) -> float:
    grams = _parse_weight_grams(net_weight_str)
    if grams is None:
        return settings.MIN_FONT_HEIGHT_MM_MEDIUM_PACK
    if grams <= 200:
        return settings.MIN_FONT_HEIGHT_MM_SMALL_PACK
    if grams <= 1000:
        return settings.MIN_FONT_HEIGHT_MM_MEDIUM_PACK
    return settings.MIN_FONT_HEIGHT_MM_LARGE_PACK


def check_rule_6(physical_data: dict, boxes: dict) -> list:
    violations = []
    for field_key, display_name in MANDATORY_FIELDS:
        if physical_data.get(field_key) in (None, "", "N/A"):
            violations.append({
                "rule_type": RuleType.RULE_6_MANDATORY_DECLARATION,
                "description": f"Rule 6 violation: '{display_name}' is missing from the physical package label.",
                "bounding_box_coordinates": boxes.get(field_key),
            })
    return violations


def check_rule_7(font_height_mm: Optional[float], net_weight_str: Optional[str], boxes: dict) -> list:
    if font_height_mm is None:
        return []
    min_req = _min_font_height(net_weight_str)
    if font_height_mm < min_req:
        return [{
            "rule_type": RuleType.RULE_7_FONT_LEGIBILITY,
            "description": (
                f"Rule 7 violation: Font height ({font_height_mm}mm) is below the "
                f"minimum required ({min_req}mm) for this package size tier."
            ),
            "bounding_box_coordinates": boxes.get("net_weight") or boxes.get("mrp"),
        }]
    return []


def check_overcharging(scraped_mrp: Optional[float], physical_mrp: Optional[float], boxes: dict) -> list:
    if scraped_mrp is None or physical_mrp is None:
        return []
    if scraped_mrp > physical_mrp + settings.LEGAL_MRP_TOLERANCE:
        return [{
            "rule_type": RuleType.OVERCHARGING,
            "description": (
                f"Overcharging violation: Web-listed MRP (₹{scraped_mrp:.2f}) exceeds "
                f"physical package MRP (₹{physical_mrp:.2f})."
            ),
            "bounding_box_coordinates": boxes.get("mrp"),
        }]
    return []


def run_all_checks(
    scraped_mrp: Optional[float],
    physical_data: dict,
    detected_font_height_mm: Optional[float],
    field_bounding_boxes: dict,
) -> list:
    violations = []
    violations += check_rule_6(physical_data, field_bounding_boxes)
    violations += check_rule_7(
        detected_font_height_mm,
        physical_data.get("physical_net_weight"),
        field_bounding_boxes,
    )
    violations += check_overcharging(scraped_mrp, physical_data.get("physical_mrp"), field_bounding_boxes)
    return violations


def calculate_compliance_score(violations: list) -> float:
    score = 100.0
    for v in violations:
        score -= SCORE_DEDUCTIONS.get(v["rule_type"], 10)
    return max(score, 0.0)
