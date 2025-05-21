from typing import List
from fastapi import APIRouter, Depends
from requests import Session

from app.api.schema import StreamerRankOut
from app.db.database import get_db
from app.models.streamer_rank import StreamerRank


router = APIRouter()


@router.get("/streamer/lol-rank", response_model=List[StreamerRankOut])
def get_lol_rank(db: Session = Depends(get_db)):
    return db.query(StreamerRank).all()
