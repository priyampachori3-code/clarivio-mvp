# Clarivio - GST Reconciliation for CA Firms

Clarivio is a live-ready FastAPI + React app for reconciling GSTR-2B JSON from the GST portal against a Tally purchase register Excel export.

## Deploy

This repo includes a Dockerfile and Render blueprint. The container builds the React frontend, runs FastAPI, and serves the compiled app from the same URL.

### Render

1. Create a new Render Web Service from this GitHub repo.
2. Choose Docker as the runtime.
3. Set `SECRET_KEY` to a long random value.
4. Deploy.

After deploy, the app is available at your Render service URL. API docs are at `/docs`.

## Local Development

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Tally Excel Format

Expected columns, case-insensitive:
- GSTIN or Party GSTIN
- Invoice No or Voucher No
- Invoice Date
- Taxable Value
- IGST, CGST, SGST
