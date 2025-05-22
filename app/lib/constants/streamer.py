from typing import Literal, List
from pydantic import BaseModel


class Streamer(BaseModel):
    nickname: str
    platform: Literal["chzzk", "soop"]
    lol_nickname: str
    lol_tag: str


streamer_data: List[Streamer] = [
    Streamer(nickname="고수달", platform="chzzk", lol_nickname="고수달", lol_tag="KR1"),
    Streamer(
        nickname="앰비션", platform="chzzk", lol_nickname="폭삭늙음", lol_tag="삼대떡"
    ),
    Streamer(
        nickname="크캣", platform="chzzk", lol_nickname="CrazyCat33", lol_tag="KR1"
    ),
    Streamer(
        nickname="프레이", platform="soop", lol_nickname="위험도움", lol_tag="4106"
    ),
    Streamer(
        nickname="플레임", platform="chzzk", lol_nickname="Goldtec", lol_tag="Flame"
    ),
    Streamer(nickname="한동숙", platform="chzzk", lol_nickname="칸치로", lol_tag="275"),
    Streamer(
        nickname="랄로", platform="chzzk", lol_nickname="위험도움", lol_tag="4106"
    ),
    Streamer(
        nickname="탬탬버린",
        platform="chzzk",
        lol_nickname="탬탬 또 너야",
        lol_tag="힐링캠프",
    ),
]
