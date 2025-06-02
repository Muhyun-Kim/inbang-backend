import express from "express";
import "dotenv/config";
import { startScheduledJob } from "./schedular";
import { prisma } from "./db";
import { getLive } from "./api/chzzk";
import { savePuuid, updateRank } from "./api/riot";

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server ready: http://localhost:${PORT}`);
});

startScheduledJob();

app.get("/streamer/lol-rank", async (req, res) => {
  // const { platform } = req.query as { platform?: string };
  // const streamerRank = await prisma.lolStreamerRank.findMany({
  //   where: {
  //     ...(platform && { platform }),
  //   },
  //   orderBy: {
  //     leaguePoints: "desc",
  //   },
  // });
  // res.json({ streamerRank });
});

app.get("/chzzk/live/:gameName", async (req, res) => {
  const { gameName } = req.params as { gameName: string };
  const live = await getLive(gameName);
  res.json({ live });
});

// 개발자 전용 api
app.get("/save/rank", async (req, res) => {
  await updateRank();
  res.json({ message: "success" });
});
