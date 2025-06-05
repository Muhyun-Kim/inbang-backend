import { Platform } from "@prisma/client";
import { prisma } from "../db";

interface StreamerQuery {
  platform?: Platform;
  name?: string;
}

export const findStreamers = async ({ platform, name }: StreamerQuery) => {
  return await prisma.streamer.findMany({
    where: {
      AND: [
        platform ? { platform } : {},
        name ? { name: { contains: name } } : {},
      ],
    },
  });
};
