import express from "express";
import "dotenv/config";
import { startScheduledJob } from "./schedular";
import { initRiotRank } from "./api/riot";

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server ready: http://localhost:${PORT}`);
});

startScheduledJob();

app.get("/streamer/lol-rank", (_, res) => {
  res.json({ message: "Hello World" });
});
