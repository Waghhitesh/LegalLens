import os
import requests
from pyzbar.pyzbar import decode
from PIL import Image

def decode_barcode(image_path: str) -> str | None:
    try:
        img = Image.open(image_path)
        decoded = decode(img)
        if decoded:
            return decoded[0].data.decode("utf-8")
    except Exception as e:
        print(f"Barcode decode error: {e}")
    return None

def lookup_product_by_barcode(barcode: str) -> dict:
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get('status') == 1:
                p = data['product']
                return {
                    'product_name': p.get('product_name', ''),
                    'brand_name': p.get('brands', ''),
                    'url': f'https://world.openfoodfacts.org/product/{barcode}',
                    'image_url': p.get('image_url', ''),
                    'net_weight': p.get('quantity', ''),
                }
    except Exception:
        pass
    return {
        'product_name': f'Unknown Product ({barcode})',
        'brand_name': 'Unknown',
        'url': '',
        'image_url': '',
        'net_weight': '',
    }
