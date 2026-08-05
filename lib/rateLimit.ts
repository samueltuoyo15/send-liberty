import { RateLimiterRedis, RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { getRedisClient } from "./redis";

let sendLimiterFree: RateLimiterRedis | RateLimiterMemory;
let sendLimiterPro: RateLimiterRedis | RateLimiterMemory;
let authLimiter: RateLimiterRedis | RateLimiterMemory;

function getSendLimiter(plan: "free" | "pro" = "free"): RateLimiterRedis | RateLimiterMemory {
  if (plan === "pro") {
    if (!sendLimiterPro) {
      const opts = { points: 300, duration: 60, keyPrefix: "rl_send_pro" };
      sendLimiterPro = process.env.REDIS_URL
        ? new RateLimiterRedis({ storeClient: getRedisClient(), ...opts })
        : new RateLimiterMemory(opts);
    }
    return sendLimiterPro;
  }

  if (!sendLimiterFree) {
    const opts = { points: 60, duration: 60, keyPrefix: "rl_send" };
    sendLimiterFree = process.env.REDIS_URL
      ? new RateLimiterRedis({ storeClient: getRedisClient(), ...opts })
      : new RateLimiterMemory(opts);
  }
  return sendLimiterFree;
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
  key: string,
  plan: "free" | "pro" = "free"
): Promise<RateLimitResult> {
  const limiter = type === "send" ? getSendLimiter(plan) : getAuthLimiter();
  try {
    await limiter.consume(key);
    return { success: true, resetInSeconds: 0 };
  } catch (res: unknown) {
    // rate-limiter-flexible rejects with a RateLimiterRes on limit exceeded
    if (res instanceof RateLimiterRes) {
      const resetInSeconds = Math.ceil(res.msBeforeNext / 1000) || 1;
      return { success: false, resetInSeconds };
    }
    // Redis connection error or other unexpected error — fail open so users
    // are not blocked when Redis is down
    console.error("Rate limit error, allowing request:", res);
    return { success: true, resetInSeconds: 0 };
  }
}
