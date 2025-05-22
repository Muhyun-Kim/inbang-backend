from typing import List, Literal
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.lib.constants.streamer import streamer_data

from app.api.schema import StreamerRankOut
from app.db.database import get_db
from app.models.streamer_rank import StreamerRank


router = APIRouter()


@router.get("/streamer/lol-rank", response_model=List[StreamerRankOut])
def get_lol_rank(
    platform: Literal["chzzk", "soop"] = Query(None), db: Session = Depends(get_db)
):
    if platform != None:
        nicknames = [s.nickname for s in streamer_data if s.platform == platform]
        return db.query(StreamerRank).filter(StreamerRank.streamer.in_(nicknames)).all()
    else:
        return db.query(StreamerRank).all()
