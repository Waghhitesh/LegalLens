# Automated Legal Metrology Compliance Architecture
**SIH Problem Statement 034** — Ministry of Consumer Affairs

Audits e-commerce product listings against the Legal Metrology (Packaged
Commodities) Rules, 2011 by comparing seller-declared web data against the
physical printed package (via AI-extracted label data).

## What's included

```
backend/    FastAPI + PostgreSQL + Celery/Redis backend, AI pipeline stubs
frontend/   Next.js + Tailwind "Single SKU & Package Inspector" UI
```

## Backend — run it

```bash
cd backend
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # edit DATABASE_URL / REDIS urls if needed

# Terminal 1: API server (also creates tables on startup)
uvicorn app.main:app --reload --port 8000

# Terminal 2: Celery worker (requires Redis running locally)
celery -A app.core.celery_app.celery_app worker --loglevel=info
```

Prerequisites: PostgreSQL running locally with a `legal_metrology` database
created, and Redis running on the default port. Swagger docs at
`http://localhost:8000/docs` once the server is up.

## Frontend — run it

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000`, paste a product URL, and you'll be redirected
to `/inspector/<audit_id>`, which polls the backend until the (stubbed) AI
pipeline finishes and then renders the compliance report.

## What's real vs. stubbed

- **Real**: DB schema, API contracts, Celery orchestration, Rule 6 / Rule 7 /
  overcharging reconciliation logic, PDF legal-notice generation, the full
  frontend UI (web-data panel, canvas bounding-box overlay, compliance card).
- **Stubbed** (in `backend/app/services/ai_pipeline.py`, for the AI team to
  replace): `crop_pdp` (YOLOv8), `extract_label_data` (PaddleOCR +
  Llama-3.2-Vision via Ollama), `calculate_font_height`. The function
  signatures and return shapes are fixed so nothing else needs to change once
  real inference is wired in.
- **Best-effort**: `backend/app/services/scraper.py` uses generic CSS
  selectors; real marketplaces will need site-specific parsers or a headless
  browser (Playwright) for JS-rendered listings.

## Key API endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/audit/url` | Submit an e-commerce URL, triggers async audit |
| POST | `/api/v1/audit/upload` | Field inspector: direct image + barcode upload |
| POST | `/api/v1/audit/bulk-upload` | Bulk-scan multiple package photos in one request |
| GET | `/api/v1/audit/{audit_id}` | Poll audit status/results (used by frontend) |
| GET | `/api/v1/audit/{audit_id}/report` | Download Section 39 draft legal notice PDF |
| GET | `/api/v1/dashboard/stats` | Aggregated compliance stats for charts |
| POST | `/api/v1/auth/otp/request` | Send a 6-digit OTP via email (SMTP) or SMS (Fast2SMS) |
| POST | `/api/v1/auth/otp/verify` | Check an OTP without consuming it |
| POST | `/api/v1/auth/register` | Create an account (consumes the OTP) |
| POST | `/api/v1/auth/login` | Username/password login, returns a JWT |
| GET | `/api/v1/auth/me` | Current user profile (Bearer token) |
| GET/PATCH/DELETE | `/api/v1/users` | Admin-only: list/edit/remove users |
| GET | `/api/v1/users/export/xlsx` \| `/docx` | Admin-only: export user list to Excel/Word |
| POST | `/api/v1/agent/chat` | Chat with the local Ollama agent |
| POST | `/api/v1/agent/analyze-image` | Ask the local vision model which Rule 6 fields are missing |
| POST | `/api/v1/agent/analyze-bulk` | Same, for a batch of images |

## New in this update

- **Auth & OTP**: username/password accounts, gated by an OTP sent to email
  (Gmail SMTP) or mobile (Fast2SMS), with five roles — Citizen, Admin,
  Government Official, Company, Shopkeeper. Set `SECRET_KEY`, `SMTP_USER`,
  `SMTP_PASSWORD` (a Gmail **App Password**, not your login password), and
  `FAST2SMS_API_KEY` in `backend/.env`.
- **Admin panel** (`/admin`, role-gated): view/edit/disable/delete users,
  export the full list to `.xlsx` or `.docx`.
- **Local Ollama agent**: a floating chat widget + `/api/v1/agent/*` routes
  that proxy to `ollama serve` running on the *same machine as the backend*
  (`OLLAMA_BASE_URL`, default `http://localhost:11434`). It never talks to
  Ollama directly from the browser. Requires `ollama pull llama3.2-vision`
  to actually answer.
- **Bulk image scanning**: `/api/v1/audit/bulk-upload` (full pipeline) and
  `/api/v1/agent/analyze-bulk` (fast missing-field check only) both accept
  multiple files in one request; the home page has an uploader for this.
- **Officer notification**: any audit that scores below 70 triggers a
  best-effort email to `OFFICER_NOTIFY_EMAILS` (comma-separated) — silently
  skipped if SMTP isn't configured, so it never blocks the pipeline.
- **"The Law" page** (`/law`): a static, plain-language field guide to the
  Act/Rules in the new law-book theme.
- **Read-aloud**: the inspector page can read a report aloud using the
  browser's built-in speech synthesis (no extra backend/API needed).
- **Theme**: a maroon/navy/gold "law book" palette, serif display type, and
  an *original* stylized guardian-lion seal watermark. Note: this is a
  deliberately original design, not a reproduction of India's official State
  Emblem — using that specific emblem is restricted under the State Emblem
  of India (Prohibition of Improper Use) Act, 2005.

### About Google Drive storage

The brief asked for everything to be stored in Google Drive. That still
isn't wired up: writing to a specific Drive folder from a backend needs a
Google service-account (or OAuth) credential with that folder shared to it,
which nobody has set up yet. All data (users, products, audits, violations)
is stored in PostgreSQL as before. The admin panel's Excel/Word export is the
practical workaround for now — download and drag the file into Drive
manually, or say the word and I'll wire up a real `google-api-python-client`
Drive upload once you've created a service account and shared the folder
with its email address.

### Still stubbed / left for later

- The AI pipeline (`ai_pipeline.py`) is still mocked — the agent endpoints
  above call Ollama directly for the "what's missing" check, but the core
  `crop_pdp` / `extract_label_data` / `calculate_font_height` functions used
  by the main audit pipeline are unchanged stubs, per the original scaffold.
- PDF report voice read-aloud is done client-side (browser TTS) rather than
  server-generated audio; say if you'd rather have a downloadable MP3.
- No automated tests were added for the new auth/admin/agent routes.
