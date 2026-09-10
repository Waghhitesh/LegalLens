import urllib.request
import json

url = "http://localhost:8000/api/v1/auth/login"
data = json.dumps({"username": "r.sharma", "password": "password123"}).encode()
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        print("Response:", resp.read().decode())
except Exception as e:
    print("Error:", e)
