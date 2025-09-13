from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str = Field(nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=datetime.now, nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, nullable=False
    )
