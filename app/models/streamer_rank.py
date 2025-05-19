from sqlalchemy import Column, Integer, String
from app.models import Base


class StreamerRank(Base):
    __tablename__ = "streamer_rank"

    id = Column(Integer, primary_key=True, index=True)
    streamer = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    league_points = Column(Integer, nullable=False)
