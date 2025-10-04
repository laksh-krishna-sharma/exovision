from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import select
from app.models.user import User
from app.utilities.jwt import hash_password, verify_password
from datetime import datetime
from app.utilities.logger import logger as get_logger

log = get_logger(__name__)


# Signup logic
async def signup_user(db: AsyncSession, name: str, email: str, password: str) -> User:
    try:
        # Check if user already exists
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            log.warning(f"Signup failed: Email {email} already registered")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        log.info(f"Creating new user: {email}")
        hashed_pw = hash_password(password)
        new_user = User(
            name=name,
            email=email,
            hashed_password=hashed_pw,
            created_at=datetime.utcnow(),  # Use naive UTC datetime
            updated_at=datetime.utcnow(),  # If applicable
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        log.info(f"User created successfully: {email} (ID: {new_user.id})")
        return new_user
    except HTTPException:
        raise
    except ValueError as e:
        log.warning(f"Signup validation error for {email}: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except SQLAlchemyError as e:
        log.error(f"Database error during signup for {email}: {str(e)}", exc_info=True)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        log.error(f"Unexpected error during signup for {email}: {str(e)}", exc_info=True)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup error: {str(e)}"
        )


# Login logic
async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> Optional[User]:
    try:
        log.info(f"Authenticating user: {email}")
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            log.warning(f"Authentication failed: User {email} not found")
            return None
        if not verify_password(password, user.hashed_password):
            log.warning(f"Authentication failed: Invalid password for {email}")
            return None
        log.info(f"Authentication successful for {email}")
        return user
    except SQLAlchemyError as e:
        log.error(f"Database error during authentication for {email}: {str(e)}", exc_info=True)
        return None
    except Exception as e:
        log.error(f"Unexpected error during authentication for {email}: {str(e)}", exc_info=True)
        return None
