from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import reconciliation, auth

app = FastAPI(title="Clarivio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(reconciliation.router, prefix="/reconcile", tags=["reconciliation"])

@app.get("/")
def root():
    return {"status": "Clarivio API running"}
