"""
Scraper Service.
Fetches an e-commerce product page and extracts seller-declared fields.
Supports JSON-LD structured data + site-specific fallbacks for Amazon/Flipkart.
"""
import json
import re
from dataclasses import dataclass
from typing import Optional

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

MRP_PATTERN = re.compile(r"[\u20B9Rs.]*\s?([\d,]+(?:\.\d{1,2})?)")


@dataclass
class ScrapedData:
    mrp: Optional[float]
    net_weight: Optional[str]
    manufacturer: Optional[str]
    country_of_origin: Optional[str]
    consumer_care: Optional[str]
    image_url: Optional[str]


def _parse_price(text: str) -> Optional[float]:
    if not text:
        return None
    match = MRP_PATTERN.search(text.replace(",", ""))
    return float(match.group(1)) if match else None


def _try_json_ld(soup: BeautifulSoup) -> dict:
    """Extract data from schema.org JSON-LD if present."""
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "{}")
            if isinstance(data, list):
                data = next((d for d in data if d.get("@type") == "Product"), {})
            if data.get("@type") == "Product":
                return data
        except (json.JSONDecodeError, TypeError):
            continue
    return {}


def scrape_product_page(url: str) -> ScrapedData:
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "lxml")

    mrp = None
    net_weight = None
    manufacturer = None
    country_of_origin = None
    consumer_care = None
    image_url = None

    # 1. Try JSON-LD structured data
    ld = _try_json_ld(soup)
    if ld:
        offers = ld.get("offers", {})
        if isinstance(offers, list):
            offers = offers[0] if offers else {}
        price = offers.get("price") or ld.get("price")
        if price:
            try:
                mrp = float(str(price).replace(",", ""))
            except ValueError:
                pass
        images = ld.get("image", [])
        if isinstance(images, str):
            image_url = images
        elif isinstance(images, list) and images:
            image_url = images[0]
        brand = ld.get("brand", {})
        if isinstance(brand, dict):
            manufacturer = brand.get("name")
        elif isinstance(brand, str):
            manufacturer = brand

    # 2. Site-specific selectors
    if mrp is None:
        selectors = [
            "span.a-price-whole",  # Amazon
            "._30jeq3",            # Flipkart
            "[class*='price']:not([class*='original']):not([class*='strike'])",
            "[id*='price']",
        ]
        for sel in selectors:
            el = soup.select_one(sel)
            if el:
                mrp = _parse_price(el.get_text())
                if mrp:
                    break

    if image_url is None:
        img_selectors = [
            "img#landingImage",   # Amazon
            "img._396cs4",         # Flipkart
            "img[class*='product-image']",
            "img[class*='ProductImage']",
        ]
        for sel in img_selectors:
            el = soup.select_one(sel)
            if el:
                image_url = el.get("src") or el.get("data-src") or el.get("data-old-hires")
                if image_url:
                    break

    # 3. Text-based extraction
    body_text = soup.get_text(" ", strip=True)
    if net_weight is None:
        m = re.search(r"(\d+\.?\d*\s?(?:g|kg|ml|l|L|litre|liter|gram|grams))\b", body_text, re.IGNORECASE)
        if m:
            net_weight = m.group(1)

    # Country of origin
    m = re.search(r"Country of Origin[:\s]+([A-Za-z ]+)", body_text, re.IGNORECASE)
    if m:
        country_of_origin = m.group(1).strip().split("\n")[0][:50]

    return ScrapedData(
        mrp=mrp,
        net_weight=net_weight,
        manufacturer=manufacturer,
        country_of_origin=country_of_origin,
        consumer_care=consumer_care,
        image_url=image_url,
    )


def download_image(image_url: str, dest_path: str) -> str:
    response = requests.get(image_url, headers=HEADERS, timeout=15, stream=True)
    response.raise_for_status()
    with open(dest_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    return dest_path
