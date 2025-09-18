from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.user import User
from app.utilities.jwt import hash_password, verify_password
from datetime import datetime


# Signup logic
async def signup_user(db: AsyncSession, name: str, email: str, password: str) -> User:
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
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
    return new_user


# Login logic
async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
