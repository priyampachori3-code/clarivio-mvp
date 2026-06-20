from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.core.security import (
    hash_password, verify_password, create_access_token,
    decode_token, USERS_DB
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class RegisterRequest(BaseModel):
    email: str
    password: str
    firm_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    firm_name: str

def get_current_user(token: str = Depends(oauth2_scheme)):
    email = decode_token(token)
    if not email or email not in USERS_DB:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return USERS_DB[email]

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest):
    if data.email in USERS_DB:
        raise HTTPException(status_code=400, detail="Email already registered")
    USERS_DB[data.email] = {
        "email": data.email,
        "hashed_password": hash_password(data.password),
        "firm_name": data.firm_name,
    }
    token = create_access_token({"sub": data.email})
    return {"access_token": token, "token_type": "bearer", "firm_name": data.firm_name}

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USERS_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer", "firm_name": user["firm_name"]}

@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "firm_name": current_user["firm_name"]}
