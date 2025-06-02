import { prisma } from "../db";
import { streamerData } from "../lib/constants";

const endPoint = {
  puuid: "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id",
  rank: "https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid",
};

interface ApiRankWithStreamer {
  streamer: string;
  tier: string;
  leaguePoints: number;
  platform: string;
}

export const initRiotRank = async () => {
  console.log("🔄 리그 오브 레전드 랭크 초기화 중...");
  const streamerRankList: ApiRankWithStreamer[] = [];
  try {
    for (const streamer of streamerData) {
      const puuid = await getPuuid({
        gameName: streamer.lol_nickname,
        tagLine: streamer.lol_tag,
      });
      if (!puuid) {
        continue;
      }
      const rank = await getRank({ puuid: puuid.puuid });
      if (!rank) {
        continue;
      }
      streamerRankList.push({
        streamer: streamer.nickname,
        tier: rank.tier,
        leaguePoints: rank.leaguePoints,
        platform: streamer.platform,
      });
    }
    await saveRank({ rankWithStreamer: streamerRankList });
  } catch (e) {
    console.log(e);
  }
};

interface PuuidRes {
  puuid: string;
  gameName: string;
  tagLine: string;
}

const getPuuid = async ({
  gameName,
  tagLine,
}: {
  gameName: string;
  tagLine: string;
}): Promise<PuuidRes | null> => {
  const url = `${endPoint.puuid}/${gameName}/${tagLine}`;
  try {
    const riotApiKey = process.env.RIOT_API_KEY;
    if (!riotApiKey) {
      throw new Error("RIOT_API_KEY is not set");
    }
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": riotApiKey,
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

interface RankRes {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  puuid: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

const getRank = async ({
  puuid,
}: {
  puuid: string;
}): Promise<RankRes | null> => {
  const url = `${endPoint.rank}/${puuid}`;
  try {
    const riotApiKey = process.env.RIOT_API_KEY;
    if (!riotApiKey) {
      throw new Error("RIOT_API_KEY is not set");
    }
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": riotApiKey,
      },
    });
    const data = await res.json();
    return data[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

const saveRank = async ({
  rankWithStreamer,
}: {
  rankWithStreamer: ApiRankWithStreamer[];
}) => {
  for (const rank of rankWithStreamer) {
    console.log(rank);
    await prisma.lolStreamerRank.upsert({
      where: { streamer: rank.streamer },
      update: {
        tier: rank.tier,
        leaguePoints: rank.leaguePoints,
      },
      create: {
        streamer: rank.streamer,
        tier: rank.tier,
        leaguePoints: rank.leaguePoints,
        platform: rank.platform,
      },
    });
  }
};
