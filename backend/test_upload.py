"""Test the upload endpoint with a sample image."""
import urllib.request
import json
import os

# 1. Login first
url = "http://localhost:8000/api/v1/auth/login"
data = json.dumps({"username": "r.sharma", "password": "password123"}).encode()
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
with urllib.request.urlopen(req, timeout=10) as resp:
    token = json.loads(resp.read().decode())["access_token"]
print("Login OK, token obtained")

# 2. Test upload with a dummy image
import io
from PIL import Image
img = Image.new("RGB", (200, 200), color="white")
from PIL import ImageDraw
draw = ImageDraw.Draw(img)
draw.text((10, 10), "MRP Rs. 45.00", fill="black")
draw.text((10, 40), "Net Wt: 250g", fill="black")
draw.text((10, 70), "Mfg by: Test Corp", fill="black")
draw.text((10, 100), "Made in India", fill="black")

test_img_path = "test_product.jpg"
img.save(test_img_path)

# 3. Upload via multipart
import http.client
import mimetypes

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = []
body.append(f"--{boundary}".encode())
body.append(b'Content-Disposition: form-data; name="images"; filename="test_product.jpg"')
body.append(b"Content-Type: image/jpeg")
body.append(b"")
with open(test_img_path, "rb") as f:
    body.append(f.read())
body.append(f"--{boundary}--".encode())

content = b"\r\n".join(body)

req2 = urllib.request.Request(
    "http://localhost:8000/api/v1/audit/upload",
    data=content,
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Authorization": f"Bearer {token}",
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req2, timeout=120) as resp2:
        print("Upload Status:", resp2.status)
        result = json.loads(resp2.read().decode())
        print("Result:", json.dumps(result, indent=2))
except Exception as e:
    print(f"Upload Error: {e}")
    if hasattr(e, 'read'):
        print("Response:", e.read().decode())

os.remove(test_img_path)
