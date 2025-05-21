from fastapi import FastAPI
from app.api import streamer
from app.api.riot_service import init_riot_rank
from app.schedular import lifespan

app = FastAPI(lifespan=lifespan)
app.include_router(streamer.router)
