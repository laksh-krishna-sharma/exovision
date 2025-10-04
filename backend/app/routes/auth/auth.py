from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from .schema.auth import SignupRequest
from typing import Dict, Any

from app.utilities.db import get_db
from app.services.auth.auth import (
    signup_user,
    authenticate_user,
)
from app.utilities.jwt import create_access_token
from app.config import settings
from app.utilities.logger import logger as get_logger

router = APIRouter(prefix="/auth", tags=["auth"])

log = get_logger(__name__)


# Update the signup function
@router.post("/signup")
async def signup(
    request: SignupRequest,  # Use the model instead of individual params
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    try:
        log.info(f"Signup attempt for email: {request.email}")
        user = await signup_user(db, request.name, request.email, request.password)
        log.info(f"Signup successful for user: {user.email} (ID: {user.id})")
        return {"id": user.id, "name": user.name, "email": user.email}
    except HTTPException as e:
        log.warning(f"Signup failed for {request.email}: {e.detail}")
        raise
    except Exception as e:
        log.error(
            f"Unexpected error during signup for {request.email}: {str(e)}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}",
        )


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)
) -> Dict[str, str]:
    try:
        log.info(f"Login attempt for email: {form_data.username}")
        user = await authenticate_user(db, form_data.username, form_data.password)
        if not user:
            log.warning(f"Login failed for {form_data.username}: Invalid credentials")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        log.info(f"Login successful for user: {user.email} (ID: {user.id})")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user.id),
        }
    except HTTPException:
        raise
    except Exception as e:
        log.error(
            f"Unexpected error during login for {form_data.username}: {str(e)}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}",
        )
