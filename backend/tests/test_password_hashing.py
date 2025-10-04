from pathlib import Path
import sys

import pytest

# Ensure the backend package is importable when running tests directly.
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from passlib.context import CryptContext

from app.utilities.jwt import hash_password, verify_password


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
