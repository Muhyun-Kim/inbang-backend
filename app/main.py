from fastapi import FastAPI, HTTPException
from app.config import settings
import requests
from pydantic import BaseModel
from app.lib.constants.streamer import Streamer, streamer_data
from typing import List
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import time


class PuuidRes(BaseModel):
    puuid: str
    gameName: str
    tagLine: str


class RankRes(BaseModel):
    leagueId: str
    queueType: str
    tier: str
    rank: str
    summonerId: str
    puuid: str
    leaguePoints: int
    wins: int
    losses: int
    veteran: bool
    inactive: bool
    freshBlood: bool
    hotStreak: bool


class StreamerRank(BaseModel):
    streamer: str
    tier: str
    leaguePoints: int


scheduler = BackgroundScheduler()


def my_job():
    print(f"⏰ 주기적 실행: {time.strftime('%X')}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시 실행
    scheduler.add_job(my_job, "interval", seconds=10)
    scheduler.start()
    print("✅ 스케줄러 시작됨")
    yield
    # 서버 종료 시 실행
    scheduler.shutdown()
    print("🛑 스케줄러 종료됨")


app = FastAPI(lifespan=lifespan)
scheduler = BackgroundScheduler()

api_endpoint = {
    "puuid": "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id",
    "rank": "https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid",
}


@app.get("/riot")
def read_root():
    streamer_rank_list: List[StreamerRank] = []
    for streamer in streamer_data:
        puuid_res = get_puuid(streamer.lolNickname, streamer.lolTag)
        rank_res = get_rank(puuid_res.puuid)
        streamer_rank_list.append(
            StreamerRank(
                streamer=streamer.nickname,
                tier=rank_res.tier,
                leaguePoints=rank_res.leaguePoints,
            )
        )
    return {"rank": streamer_rank_list}


def get_puuid(game_name: str, tagLine: str) -> PuuidRes:
    url = f"{api_endpoint['puuid']}/{game_name}/{tagLine}"
    response = requests.get(url, headers={"X-Riot-Token": settings.riot_api_key})
    if response.status_code == 200:
        return PuuidRes(**response.json())
    else:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to get puuid"
        )


def get_rank(puuid: str) -> RankRes:
    url = f"{api_endpoint['rank']}/{puuid}"
    response = requests.get(url, headers={"X-Riot-Token": settings.riot_api_key})
    if response.status_code == 200:
        return RankRes(**response.json()[0])
    else:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to get rank"
        )


def my_job():
    print(f"⏰ 주기적 실행: {time.strftime('%X')}")


@app.on_event("startup")
def startup_event():
    scheduler.add_job(my_job, "interval", seconds=10)  # 10초마다 실행
    scheduler.start()


@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()
