import sys
from typing import Any, Dict, List, Optional

from pydantic import BaseSettings, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Emotion Detection"
    VERSION: str = "0.1.0"

    SENTRY_DSN: Optional[HttpUrl] = None

    API_PATH: str = "/v1"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    BACKEND_CORS_ORIGINS: List[str] = []

    # Backend URL
    REACT_APP_BACKEND_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
