from datetime import datetime, timedelta
from typing import List, Optional, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from uuid import UUID

# Configuration (In production, use environment variables)
SECRET_KEY = "SUPER_SECRET_DENTAL_OS_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str
    permissions: List[str]

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
    permissions: List[str] = []

class UserProfile(BaseModel):
    id: UUID
    employee_id: str
    email: EmailStr
    role: str
    permissions: List[str]
    is_active: bool

class LoginRequest(BaseModel):
    employee_id: str
    password: str

class MFARequest(BaseModel):
    mfa_token: str
    code: str

# --- Security Functions ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Dependencies ---

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        permissions: List[str] = payload.get("permissions", [])
        if user_id is None:
            raise credentials_exception
        return TokenData(user_id=user_id, role=role, permissions=permissions)
    except JWTError:
        raise credentials_exception

def require_permission(resource: str, action: str):
    async def permission_checker(current_user: TokenData = Depends(get_current_user)):
        # Check for admin wildcard
        if "*:*" in current_user.permissions:
            return current_user
        
        required = f"{resource}:{action}"
        wildcard = f"{resource}:*"
        
        if required in current_user.permissions or wildcard in current_user.permissions:
            return current_user
            
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Missing required permission: {required}"
        )
    return permission_checker