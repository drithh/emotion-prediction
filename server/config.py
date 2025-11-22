from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Emotion Detection"
    VERSION: str = "0.1.0"

    API_PATH: str = "/v1"

    # Backend URL
    BACKEND_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"


settings = Settings()
