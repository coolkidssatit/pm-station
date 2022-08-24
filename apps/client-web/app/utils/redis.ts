import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.PM_STATION_REDIS_URL as string,
  token: process.env.PM_STATION_REDIS_TOKEN as string,
});

export { redis };
