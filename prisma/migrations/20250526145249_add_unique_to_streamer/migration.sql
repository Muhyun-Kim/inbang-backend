/*
  Warnings:

  - A unique constraint covering the columns `[streamer]` on the table `StreamerRank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StreamerRank_streamer_key" ON "StreamerRank"("streamer");
