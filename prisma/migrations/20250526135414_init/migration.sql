-- CreateTable
CREATE TABLE "StreamerRank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamer" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL
);
