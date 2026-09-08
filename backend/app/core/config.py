"""
Central application configuration.
Reads from environment variables / .env file.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database (SQLite by default — zero config) ---
    DATABASE_URL: str = "sqlite:///./legallens.db"

    # --- Local AI (Ollama) ---
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_VISION_MODEL: str = "llava"  # user has llava installed
    OLLAMA_TEXT_MODEL: str = "llava"
    OLLAMA_TIMEOUT_SECONDS: float = 90.0

    # --- Storage ---
    UPLOAD_DIR: str = "./uploads"
    REPORTS_DIR: str = "./reports"
    EXPORTS_DIR: str = "./exports"

    # --- Auth / JWT ---
    SECRET_KEY: str = "SIH2026_LegalLens_DevKey_ChangeInProduction"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720  # 12h

    # --- OTP ---
    OTP_EXPIRE_MINUTES: int = 10

    # --- Email (optional) ---
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # --- Compliance rules (Legal Metrology PCR 2011) ---
    MIN_FONT_HEIGHT_MM_SMALL_PACK: float = 1.0
    MIN_FONT_HEIGHT_MM_MEDIUM_PACK: float = 2.0
    MIN_FONT_HEIGHT_MM_LARGE_PACK: float = 4.0
    LEGAL_MRP_TOLERANCE: float = 0.0

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
