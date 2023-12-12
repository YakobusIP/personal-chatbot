import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
