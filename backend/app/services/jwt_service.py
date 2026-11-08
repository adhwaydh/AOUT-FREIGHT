import os
from datetime import datetime, timedelta, timezone

from jose import jwt


SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY and os.getenv("VERCEL") == "1":
    raise RuntimeError(
        "JWT_SECRET_KEY must be configured in Vercel Environment Variables."
    )

# Local-only fallback; production deployments must set JWT_SECRET_KEY.
SECRET_KEY = SECRET_KEY or "CHANGE_THIS_DEVELOPMENT_SECRET"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def create_access_token(
    user_id: int,
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )