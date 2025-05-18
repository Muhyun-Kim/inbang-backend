from typing import Literal, List
from pydantic import BaseModel


class Streamer(BaseModel):
    nickname: str
    platform: Literal["chzzk", "soop"]
    lolNickname: str
    lolTag: str


streamer_data: List[Streamer] = [
    Streamer(nickname="고수달", platform="chzzk", lolNickname="고수달", lolTag="KR1"),
    Streamer(
        nickname="앰비션", platform="chzzk", lolNickname="폭삭늙음", lolTag="삼대떡"
    ),
]
