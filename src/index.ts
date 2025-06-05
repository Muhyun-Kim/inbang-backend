import express from "express";
import "dotenv/config";
import { startScheduledJob } from "./schedular";
import { getLive } from "./api/chzzk";
import { updateRank } from "./api/riot";
import streamerRouter from "./routes/streamer.route";

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server ready: http://localhost:${PORT}`);
});

startScheduledJob();

// streamer
app.use("/streamer", streamerRouter);

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
