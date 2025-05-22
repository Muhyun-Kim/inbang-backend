from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import time

from app.api.riot_service import init_riot_rank

# from app.services.streamer_rank import init_riot_rank

scheduler = BackgroundScheduler()


def my_job():
    print(f"⏰ {time.strftime('%X')}")
    # init_riot_rank()


@asynccontextmanager
async def lifespan(app):
    scheduler.add_job(init_riot_rank, "interval", seconds=300)
    scheduler.start()
    print("✅ 스케줄러 시작됨")

    yield
    scheduler.shutdown()
    print("🛑 스케줄러 종료됨")
