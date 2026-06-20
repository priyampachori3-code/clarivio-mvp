# Clarivio — GST Reconciliation for CA Firms

## What it does
- Upload GSTR-2B (JSON from portal) + Tally purchase register (Excel)
- Matches invoices via exact + fuzzy matching
- Shows colour-coded summary: Matched / Mismatch / Portal Only / Tally Only
- Download a colour-coded Excel report

---

## Prerequisites (install these once)

1. **Python 3.11+**  
   Download from https://www.python.org/downloads/  
   ✅ Check "Add Python to PATH" during install

2. **Node.js 20+**  
   Download from https://nodejs.org/  
   (LTS version)

3. **Git** (optional but useful)  
   https://git-scm.com/download/win

---

## First-time Setup

```
Double-click setup.bat
```

That's it. It:
- Creates a Python virtual environment
- Installs all backend packages
- Installs all frontend packages

---

## Running the App

```
Double-click start.bat
```

Two terminal windows open. Then visit:
**http://localhost:5173**

---

## Folder Structure

```
clarivio/
├── backend/
│   ├── main.py                          ← FastAPI app entry point
│   ├── requirements.txt
│   └── app/
│       ├── api/
│       │   ├── auth.py                  ← Login / register endpoints
│       │   └── reconciliation.py        ← Upload + reconcile endpoints
│       ├── core/
│       │   ├── config.py                ← Settings
│       │   └── security.py              ← JWT + password hashing
│       └── services/
│           └── reconciliation_engine.py ← Core matching logic
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      ← Routes
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx             ← Login / register UI
│   │   │   └── Dashboard.jsx            ← Main reconciliation UI
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   └── ResultsTable.jsx
│   │   ├── hooks/useAuth.jsx            ← Auth context
│   │   └── utils/api.js                 ← Axios client
├── setup.bat                            ← Run once to install
└── start.bat                            ← Run to launch
```

---

## Match Logic

| Status | Meaning |
|--------|---------|
| ✅ Matched | Exact GSTIN + Invoice No + amount within ₹1 |
| ⚠️ Amount Mismatch | Exact keys match but amount differs |
| 🟡 Fuzzy Match | Invoice No is similar (≥85% match) same GSTIN |
| 🔴 Portal Only | Invoice in GSTR-2B but not in Tally |
| 🔵 Tally Only | Invoice in Tally but not in portal |

---

## Tally Excel Format Expected

Your Tally export should have columns named (case-insensitive):
- `GSTIN` or `Party GSTIN`
- `Invoice No` or `Voucher No`
- `Invoice Date`
- `Taxable Value`
- `IGST`, `CGST`, `SGST`

---

## API Docs
Visit http://localhost:8000/docs for the interactive Swagger UI.
