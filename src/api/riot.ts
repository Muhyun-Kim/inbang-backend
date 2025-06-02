import { prisma } from "../db";

const endPoint = {
  puuid: "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id",
  rank: "https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid",
};

export const savePuuid = async () => {
  const streamerData = await prisma.riotAccount.findMany({
    where: {
      puuid: null,
    },
  });
  for (const streamer of streamerData) {
    const puuid = await getPuuid({
      gameName: streamer.gameName,
      tagLine: streamer.tagLine,
    });
    if (!puuid) {
      continue;
    }
    await prisma.riotAccount.update({
      where: {
        id: streamer.id,
      },
      data: {
        puuid: puuid.puuid,
      },
    });
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

export const initRiotRank = async () => {
  console.log("🔄 리그 오브 레전드 랭크 초기화 중...");
  await savePuuid();
  await updateRank();
  console.log("🔄 리그 오브 레전드 랭크 초기화 완료");
};

export const updateRank = async () => {
  const riotAccountList = await prisma.riotAccount.findMany({
    where: {
      puuid: {
        not: null,
      },
    },
  });
  for (const riotAccount of riotAccountList) {
    if (!riotAccount.puuid) {
      continue;
    }
    const rank = await getRank({ puuid: riotAccount.puuid });
    if (!rank) {
      continue;
    }
    await prisma.lolStreamerRank.upsert({
      where: {
        riotAccountId: riotAccount.id,
      },
      update: {
        tier: rank.tier,
        leaguePoints: rank.leaguePoints,
      },
      create: {
        riotAccountId: riotAccount.id,
        tier: rank.tier,
        leaguePoints: rank.leaguePoints,
      },
    });
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
