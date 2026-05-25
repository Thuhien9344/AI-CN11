from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings and configuration."""

    # Basic App Settings
    app_name: str = "AI Education System"
    debug: bool = False
    version: str = "0.1.0"

    # Database
    database_url: str = "postgresql://ai_user:ai_password@localhost:5432/ai_education"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"

    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]

    # AI Service
    ai_model: str = "mistral"  # or "llama", "gpt"
    ai_api_key: Optional[str] = None
    ai_base_url: Optional[str] = None

    # Features
    enable_3d_simulation: bool = True
    enable_chatbot: bool = True
    enable_gamification: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
