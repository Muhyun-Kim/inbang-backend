/*
  Warnings:

  - You are about to drop the `StreamerRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StreamerRank";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "LolStreamerRank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamer" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LolStreamerRank_streamer_key" ON "LolStreamerRank"("streamer");
