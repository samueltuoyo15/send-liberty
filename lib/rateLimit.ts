import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import { getRedisClient } from "./redis";

let sendLimiter: RateLimiterRedis | RateLimiterMemory;
let authLimiter: RateLimiterRedis | RateLimiterMemory;

function getSendLimiter(): RateLimiterRedis | RateLimiterMemory {
  if (!sendLimiter) {
    const opts = { points: 60, duration: 60, keyPrefix: "rl_send" };
    sendLimiter = process.env.REDIS_URL
      ? new RateLimiterRedis({ storeClient: getRedisClient(), ...opts })
      : new RateLimiterMemory(opts);
  }
  return sendLimiter;
}

function getAuthLimiter(): RateLimiterRedis | RateLimiterMemory {
  if (!authLimiter) {
    const opts = { points: 10, duration: 60, keyPrefix: "rl_auth" };
    authLimiter = process.env.REDIS_URL
      ? new RateLimiterRedis({ storeClient: getRedisClient(), ...opts })
      : new RateLimiterMemory(opts);
  }
  return authLimiter;
}

export type LimiterType = "send" | "auth";

export interface RateLimitResult {
  success: boolean;
  resetInSeconds: number;
}

export async function rateLimit(
  type: LimiterType,
  key: string
): Promise<RateLimitResult> {
  const limiter = type === "send" ? getSendLimiter() : getAuthLimiter();
  try {
    await limiter.consume(key);
    return { success: true, resetInSeconds: 0 };
  } catch (res: any) {
    const resetInSeconds = Math.ceil(res?.msBeforeNextConsume / 1000) || 60;
    return { success: false, resetInSeconds };
  }
}
