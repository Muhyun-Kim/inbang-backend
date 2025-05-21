from pydantic import BaseModel, Field, ConfigDict


class StreamerRankOut(BaseModel):
    id: int
    streamer: str
    tier: str
    league_points: int = Field(..., alias="leaguePoints")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
