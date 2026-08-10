import { connectToRedis } from "./redis";
import crypto from "crypto";

export type LimiterType = "send" | "auth" | "login" | "signup" | "password_reset";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTimestamp: number;
}

export async function rateLimit(
  type: LimiterType,
  key: string,
  plan: "free" | "pro" = "free"
): Promise<RateLimitResult> {
  const windowSeconds = 60;
  const limit = (type === "auth" || type === "login" || type === "signup" || type === "password_reset") ? 10 : plan === "pro" ? 300 : 30;
  
  const safeKey = crypto.createHash("sha256").update(`${type}:${plan}:${key}`).digest("hex");
  const limitKey = `rl_${safeKey}`;

  try {
    const client = connectToRedis();
    const script = `
      local current = redis.call("INCR", KEYS[1])
      if current == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
      end
      return current
    `;

    const current = await client.eval(script, 1, limitKey, windowSeconds) as number;
    const ttl = await client.ttl(limitKey);
    const resetTimestamp = Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : windowSeconds);
    const remaining = Math.max(0, limit - current);

    if (current > limit) {
      return { success: false, limit, remaining: 0, resetTimestamp };
    }

    return { success: true, limit, remaining, resetTimestamp };
  } catch (error) {
    console.error("Rate limiter unavailable", { type, error: error instanceof Error ? error.message : "Unknown" });
    const success = type === "send";
    return { success, limit, remaining: success ? limit : 0, resetTimestamp: Math.floor(Date.now() / 1000) + windowSeconds };
  }
}
