

# Cyberplug

Cyberplug is a GitHub repository vulnerability scanning API. Submit a public GitHub repo URL, and Cyberplug clones it, scans it with [Trivy](https://aquasecurity.github.io/trivy/), deduplicates the findings, and returns structured vulnerability data with an optional AI-generated risk summary.

---

## How it works

```
POST /scan  →  async clone + trivy scan + AI scoring  →  GET /scan/{id}
```

1. You submit `{ "repo_url": "https://github.com/owner/repo" }` with your API key.
2. The scan runs in the background (returns `202 Accepted` immediately with a `scan_id`).
3. Poll `GET /scan/{scan_id}` until `status` is `completed` or `failed`.
4. Optionally, provide a `callback_url` and Cyberplug will POST the result to you when done.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- That's it. Git and Trivy run inside the container.

---

## Quickstart (Docker — recommended)

**1. Clone the repo**

```bash
git clone https://github.com/Rai-jal/cyber-plug.git
cd cyber-plug
```

**2. Create your `.env` file**

```bash
cp backend/.env.example .env
```

Open `.env` and set at minimum:

```env
# Required — generate a strong random key:
#   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
API_KEY=your-strong-random-key-here

# Optional — enable AI-powered summaries
LLM_PROVIDER=claude          # or "openai"
ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-proj-...
```

**3. Start the stack**

```bash
docker compose up --build
```

The API is now running at `http://localhost:8000`.

Alembic migrations run automatically on startup — the database schema is always up to date.

---

## Manual setup (without Docker)

Requirements: Python 3.11+, PostgreSQL 14+, [Trivy](https://aquasecurity.github.io/trivy/latest/getting-started/installation/), git.

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env — set API_KEY and DATABASE_URL

alembic upgrade head
uvicorn app.main:app --reload
```

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `API_KEY` | Yes | — | Bootstrap admin key. Used as `x-api-key` header. |
| `DATABASE_URL` | Yes | `postgresql://cyberplug:cyberplug@localhost:5432/cyberplug` | PostgreSQL connection string. |
| `DEBUG` | No | `false` | Set `true` to expose `/docs`, `/redoc`, `/openapi.json`. |
| `ALLOWED_ORIGINS` | No | `[]` | JSON array of allowed CORS origins, e.g. `["https://app.example.com"]`. |
| `LLM_PROVIDER` | No | `none` | `claude` or `openai` to enable AI summaries. |
| `ANTHROPIC_API_KEY` | No | — | Required when `LLM_PROVIDER=claude`. |
| `OPENAI_API_KEY` | No | — | Required when `LLM_PROVIDER=openai`. |
| `LLM_MODEL` | No | provider default | Override the LLM model. Default: `claude-haiku-4-5-20251001` / `gpt-4o-mini`. |
| `TRIVY_TIMEOUT` | No | `300` | Seconds before a Trivy scan is aborted. |
| `CLONE_BASE_DIR` | No | `/tmp/cyberplug` | Directory where repos are cloned temporarily. |
| `SCAN_TTL_DAYS` | No | `30` | Delete completed/failed scans older than this many days. Set to `0` to disable. |

---

## API reference

All endpoints (except `/health`) require the header `x-api-key: <your-key>`.

### Health

```
GET /health
→ { "status": "ok" }
```

### Submit a scan

```
POST /scan
Content-Type: application/json
x-api-key: <key>

{
  "repo_url": "https://github.com/owner/repo",
  "callback_url": "https://yourserver.com/webhook"   // optional
}

→ 202 Accepted
{
  "scan_id": "uuid",
  "status": "pending",
  "repo": "https://github.com/owner/repo",
  "deduplicated": false
}
```

If a scan for the same repo is already pending or running, the existing `scan_id` is returned with `"deduplicated": true`.

When you provide a `callback_url`, Cyberplug will POST the completed scan result to it once the scan finishes. The webhook is delivered with `Content-Type: application/json` and retried up to 3 times with exponential backoff (1 s, 2 s) on 5xx or network errors.

Example webhook payload:

```json
{
  "scan_id": "3f1c8d2e-...",
  "status": "completed",
  "repo": "https://github.com/owner/repo",
  "created_at": "2026-04-23T10:00:00+00:00",
  "completed_at": "2026-04-23T10:01:34+00:00",
  "summary": { "critical": 1, "high": 3, "medium": 7, "low": 4, "unknown": 0 },
  "ai_analysis": {
    "risk_score": 72.4,
    "risk_level": "HIGH",
    "executive_summary": "...",
    "technical_summary": "...",
    "prioritized_findings": [...]
  },
  "compliance": {
    "enriched_vulnerabilities": [...],
    "summary": { "owasp": {...}, "iso27001": {...}, "fintech": {...} }
  }
}
```

### Get scan result

```
GET /scan/{scan_id}
x-api-key: <key>

→ 200 OK
{
  "scan_id": "...",
  "status": "completed",
  "repo": "...",
  "created_at": "...",
  "completed_at": "...",
  "summary": { "critical": 2, "high": 5, "medium": 12, "low": 8, "unknown": 0 },
  "vulnerabilities": [...],
  "normalized_vulnerabilities": [...],
  "ai_analysis": {
    "risk_score": 84.5,
    "risk_level": "CRITICAL",
    "executive_summary": "...",
    "technical_summary": "...",
    "prioritized_findings": [...]
  }
}
```

`status` values: `pending` → `running` → `completed` / `failed`

### List scans

```
GET /scans?status=completed&repo=django&limit=20&offset=0&since=2026-01-01T00:00:00Z
x-api-key: <key>
```

Query params: `status`, `repo` (substring match), `owner` (admin only), `since` (ISO 8601), `limit` (1–200), `offset`.

### Download a compliance report

```
GET /scan/{scan_id}/report?format=html
GET /scan/{scan_id}/report?format=pdf
x-api-key: <key>
```

- `format=html` (default) — returns a self-contained HTML compliance report.
- `format=pdf` — returns a PDF (requires WeasyPrint installed in the container).

The report includes: executive & technical summaries, severity distribution, OWASP Top 10 breakdown, ISO 27001 control mapping, fintech-specific risk escalation, top 10 prioritized findings, and actionable recommendations.

Possible error responses:
- `404` — scan not found
- `409` — scan not yet completed (still pending or running)
- `500` — report generation error

### API key management (admin only)

```
POST   /api-keys                    { "owner": "team-name", "expires_in_days": 90 }
→ 201 { "key_id": "uuid", "owner": "team-name", "key": "cpk_...", "expires_at": "..." }

GET    /api-keys
→ 200 [ { "key_id": "...", "owner": "...", "created_at": "...", "expires_at": "..." }, ... ]

POST   /api-keys/{key_id}/rotate   { "expires_in_days": 90 }
→ 201 { "old_key_id": "...", "new_key_id": "...", "key": "cpk_...", "expires_at": "..." }

DELETE /api-keys/{key_id}
→ 204
```

The raw key (`cpk_...`) is shown only once at creation and rotation — it is never stored. Keep it safe.

---

## Running tests

Tests use SQLite — no PostgreSQL or Trivy needed.

```bash
cd backend
source venv/bin/activate   # or: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
pytest tests/ -v
```

Expected output: **152 passed**.

---

## Database migrations

Migrations are managed with [Alembic](https://alembic.sqlalchemy.org/).

```bash
# Apply all pending migrations (runs automatically on Docker startup)
alembic upgrade head

# Generate a new migration after changing models
alembic revision --autogenerate -m "describe your change"

# Roll back one migration
alembic downgrade -1
```

---

## Security notes

- Only public `https://github.com` URLs are accepted. All other formats and private IP ranges are blocked (SSRF protection).
- Rate limit: 10 requests per minute per IP.
- API keys are stored as SHA-256 hashes — the raw key is never persisted after creation.
- Error responses never include stack traces, internal file paths, or system information.
- The container runs as a non-root user (`cyberplug`).
- Set `DEBUG=false` in production (the default) to hide the OpenAPI docs.
