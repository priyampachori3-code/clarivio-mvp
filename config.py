from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "clarivio-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 hours

    class Config:
        env_file = ".env"

settings = Settings()
