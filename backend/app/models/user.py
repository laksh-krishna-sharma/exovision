from typing import Optional
from datetime import datetime, timezone

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str = Field(nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Optional[datetime] = Field(
        default=None, sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
