import { Request, Response } from "express";
import { findStreamers } from "../models/streamer.model";
import { Platform } from "@prisma/client";

export const getStreamers = async (req: Request, res: Response) => {
  const { platform, name } = req.query;
  const data = await findStreamers({
    platform: platform as Platform,
    name: name as string,
  });
  res.json(data);
};
