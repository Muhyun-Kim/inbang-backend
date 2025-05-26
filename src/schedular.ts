import cron from "node-cron";
import { initRiotRank } from "./api/riot";

export const startScheduledJob = () => {
  cron.schedule("* * * * *", async () => {
    await initRiotRank();
  });
};
