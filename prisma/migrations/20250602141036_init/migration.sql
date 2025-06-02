-- CreateTable
CREATE TABLE "Streamer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RiotAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamerId" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    CONSTRAINT "RiotAccount_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LolStreamerRank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "riotAccountId" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    CONSTRAINT "LolStreamerRank_riotAccountId_fkey" FOREIGN KEY ("riotAccountId") REFERENCES "RiotAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_name_key" ON "Streamer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RiotAccount_puuid_key" ON "RiotAccount"("puuid");
