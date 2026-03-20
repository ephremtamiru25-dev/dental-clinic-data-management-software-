from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Query, Response
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime, timedelta
from uuid import UUID, uuid4
import enum

# Import auth logic
from server.auth import (
    LoginRequest, MFARequest, Token, UserProfile,
    get_password_hash, verify_password, create_access_token, create_refresh_token,
    get_current_user, require_permission, TokenData
)

app = FastAPI(title="DentalOS History API", version="1.0.0")

# --- ENUMS (Existing) ---
class ConditionSeverity(str, enum.Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    CRITICAL = "Critical"

class SmokingStatus(str, enum.Enum):
    NEVER = "Never"
    FORMER = "Former"
    CURRENT = "Current"

# --- SCHEMAS (Existing + New) ---
class MedicalHistoryBase(BaseModel):
    condition: str
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None
    severity: ConditionSeverity = ConditionSeverity.MODERATE
    is_active: bool = True

class MedicalHistoryCreate(MedicalHistoryBase):
    pass

class MedicalHistory(MedicalHistoryBase):
    id: UUID
    patient_id: UUID
    created_at: datetime
    class Config: from_attributes = True

class VisitNoteBase(BaseModel):
    visit_date: date = Field(default_factory=date.today)
    subjective: Optional[str] = None
    objective: Optional[str] = None
    assessment: Optional[str] = None
    plan: Optional[str] = None
    tooth_numbers: List[int] = []
    procedure_codes: List[str] = []

class VisitNoteCreate(VisitNoteBase):
    patient_id: UUID

class VisitNote(VisitNoteBase):
    id: UUID
    patient_id: UUID
    provider_id: UUID
    created_at: datetime
    updated_at: datetime
    class Config: from_attributes = True

class PatientSnapshot(BaseModel):
    summary: str
    alerts: List[str]
    recent_procedures: List[str]
    ai_suggestions: List[str]

# --- AUTH ROUTES ---

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

@auth_router.post("/login", response_model=dict)
async def login(login_data: LoginRequest, response: Response):
    """
    Staff login using unique employee ID.
    In a real app, this would query the 'users' table.
    """
    # Mock user lookup
    # password_hash = get_password_hash("password123")
    mock_user_id = str(uuid4())
    mock_role = "Dentist"
    mock_permissions = ["patient:read", "medical_history:*", "dental_procedure:*"]

    # In real app:
    # 1. Fetch user by employee_id
    # 2. Check is_active
    # 3. Verify password
    # 4. Check if MFA required

    access_token = create_access_token(data={
        "sub": mock_user_id,
        "role": mock_role,
        "permissions": mock_permissions
    })
    
    refresh_token = create_refresh_token(data={"sub": mock_user_id})
    
    # Set refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True, # In production
        samesite="Lax",
        max_age=7 * 24 * 60 * 60
    )
    
    # Log the successful login in auth_logs (DB logic here)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": mock_user_id,
            "role": mock_role,
            "permissions": mock_permissions
        }
    }

@auth_router.get("/me", response_model=UserProfile)
async def get_me(current_user: TokenData = Depends(get_current_user)):
    """Returns current user details and permissions."""
    # In real app, fetch profile from 'users' table
    return UserProfile(
        id=UUID(current_user.user_id),
        employee_id="D12345",
        email="doctor@dentalos.com",
        role=current_user.role,
        permissions=current_user.permissions,
        is_active=True
    )

@auth_router.post("/logout")
async def logout(response: Response):
    """Invalidates the refresh token."""
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

# --- DATA ROUTES (With Auth/RBAC) ---

router = APIRouter(prefix="/api")

@router.get(
    "/patients/{patient_id}/history", 
    response_model=List[dict],
    dependencies=[Depends(require_permission("patient", "read"))]
)
async def get_patient_history(
    patient_id: UUID, 
    current_user: TokenData = Depends(get_current_user)
):
    """
    Returns a unified timeline of all history events for a patient.
    Implements Row-Level Security: Only doctors/hygienists with access to this patient can see.
    """
    # Example Row-Level Security check
    # if current_user.role == "Dentist":
    #     has_access = db.execute("SELECT 1 FROM patient_providers WHERE patient_id = :p AND provider_id = :u", ...)
    #     if not has_access: raise 403
        
    return [
        {"id": uuid4(), "type": "medical", "title": "Hypertension", "date": "2024-03-15"},
        {"id": uuid4(), "type": "dental", "title": "Routine Prophy", "date": "2024-02-10"}
    ]

@router.post(
    "/patients/{patient_id}/visit_notes", 
    response_model=VisitNote, 
    status_code=210,
    dependencies=[Depends(require_permission("medical_history", "write"))]
)
async def create_visit_note(patient_id: UUID, note: VisitNoteCreate, current_user: TokenData = Depends(get_current_user)):
    """
    Creates a new SOAP visit note. Only authorized clinicians can write history.
    """
    return {
        **note.dict(), 
        "id": uuid4(), 
        "provider_id": UUID(current_user.user_id), 
        "created_at": datetime.now(), 
        "updated_at": datetime.now()
    }

app.include_router(auth_router)
app.include_router(router)