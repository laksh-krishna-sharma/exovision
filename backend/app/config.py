import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    db_uri: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )

    logging_level: str = os.getenv("LOGGING_LEVEL", "INFO")
    root_path: str = os.getenv("ROOT_PATH", "/")


settings = Settings()
