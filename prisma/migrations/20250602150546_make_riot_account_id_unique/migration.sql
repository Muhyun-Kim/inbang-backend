/*
  Warnings:

  - A unique constraint covering the columns `[riotAccountId]` on the table `LolStreamerRank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LolStreamerRank_riotAccountId_key" ON "LolStreamerRank"("riotAccountId");
