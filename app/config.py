from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    riot_api_key: str

    class Config:
        env_file = ".env"


settings = Settings()
