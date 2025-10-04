from __future__ import annotations

import sys
from pathlib import Path
from typing import Callable, Tuple

import pytest
from passlib.context import CryptContext


def _load_jwt_utils() -> Tuple[Callable[[str], str], Callable[[str, str], bool]]:
    """Ensure backend modules are importable and return hashing helpers."""

    root_dir = Path(__file__).resolve().parents[1]
    if str(root_dir) not in sys.path:
        sys.path.insert(0, str(root_dir))

    from app.utilities.jwt import hash_password as _hash_password
    from app.utilities.jwt import verify_password as _verify_password

    return _hash_password, _verify_password


hash_password, verify_password = _load_jwt_utils()


@pytest.mark.parametrize(
    "password",
    [
        "shortpass",
        "P@ssw0rd!",
        "a" * 80,  # exceed bcrypt's traditional 72 byte limit
    ],
)
def test_hash_and_verify_password(password: str) -> None:
    hashed = hash_password(password)
    assert hashed
    assert verify_password(password, hashed)


def test_legacy_bcrypt_hash_is_accepted() -> None:
    password = "legacy-password"
    legacy_ctx = CryptContext(schemes=["bcrypt"])
    legacy_hash = legacy_ctx.hash(password)

    assert verify_password(password, legacy_hash)
