import { Router } from "express";
import { getStreamers } from "../controller/streamer.controller";

const router = Router();

router.get("/", getStreamers);

export default router;
