-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RiotAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamerId" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "puuid" TEXT,
    CONSTRAINT "RiotAccount_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RiotAccount" ("gameName", "id", "puuid", "streamerId", "tagLine") SELECT "gameName", "id", "puuid", "streamerId", "tagLine" FROM "RiotAccount";
DROP TABLE "RiotAccount";
ALTER TABLE "new_RiotAccount" RENAME TO "RiotAccount";
CREATE UNIQUE INDEX "RiotAccount_puuid_key" ON "RiotAccount"("puuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
