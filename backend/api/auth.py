from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt

SECRET = "your_jwt_secret"  # 🔐 Move this to environment variable in prod
ALGORITHM = "HS256"
router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
users_db = {}

class UserRegister(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/register", response_model=Token)
def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User exists")
    users_db[user.email] = pwd_context.hash(user.password)
    token = jwt.encode({"sub": user.email}, SECRET, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"} 