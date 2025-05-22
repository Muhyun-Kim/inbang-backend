from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.db.database import SessionLocal
from app.lib.constants.streamer import streamer_data
from typing import List
import requests
from app.config import settings
from sqlalchemy.orm import Session

from app.models.streamer_rank import StreamerRank


api_endpoint = {
    "puuid": "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id",
    "rank": "https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid",
}


def root_riot():
    return {"message": "Hello, World!"}


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


class ApiRankWithStreamer(BaseModel):
    streamer: str
    tier: str
    league_points: int = Field(..., alias="leaguePoints")

    class Config:
        allow_population_by_field_name = True


def init_riot_rank():
    print("🔄 리그 오브 레전드 랭크 초기화 중...")
    streamer_rank_list: List[ApiRankWithStreamer] = []
    for streamer in streamer_data:
        puuid_res = get_puuid(streamer.lol_nickname, streamer.lol_tag)
        rank_res = get_rank(puuid_res.puuid)
        streamer_rank_list.append(
            ApiRankWithStreamer(
                streamer=streamer.nickname,
                tier=rank_res.tier,
                leaguePoints=rank_res.leaguePoints,
            )
        )
    db = SessionLocal()
    try:
        res = save_rank(streamer_rank_list, db=db)
        print(res)
    finally:
        db.close()
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


def save_rank(rank_with_streamers: List[ApiRankWithStreamer], db: Session):
    for rank_with_streamer in rank_with_streamers:
        try:
            existing = (
                db.query(StreamerRank)
                .filter_by(streamer=rank_with_streamer.streamer)
                .first()
            )

            if existing:
                existing.tier = rank_with_streamer.tier
                existing.league_points = rank_with_streamer.league_points
                db.commit()
                db.refresh(existing)
            else:
                new_entry = StreamerRank(
                    streamer=rank_with_streamer.streamer,
                    tier=rank_with_streamer.tier,
                    league_points=rank_with_streamer.league_points,
                )
                db.add(new_entry)
                db.commit()
                db.refresh(new_entry)

        except Exception as e:
            print(f"❌ 저장 실패: {rank_with_streamer.streamer} - {e}")

    return {"message": "Rank saved"}
