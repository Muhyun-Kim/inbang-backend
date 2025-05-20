from fastapi import FastAPI
from app.api.riot import init_riot_rank
from app.schedular import lifespan

app = FastAPI(lifespan=lifespan)


@app.get("/riot")
def riot():
    return init_riot_rank()
