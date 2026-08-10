import { getRedisClient } from "./redis";

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
  const windowSeconds = 60;
  
  // Determine the limit based on type and plan
  let limit = 30; // default send free
  if (type === "auth") {
    limit = 10;
  } else if (plan === "pro") {
    limit = 300;
  }

  try {
    const client = getRedisClient();
    
    // Create a predictable, visible key
    const limitKey = `rl_${type}:${plan}:${key}`;

    // Increment the number stored at key by one. If the key does not exist, it is set to 0 first.
    const current = await client.incr(limitKey);

    // If this is the first request in the window, set the expiration
    if (current === 1) {
      await client.expire(limitKey, windowSeconds);
    }

    // Check if the current request count exceeds the limit
    if (current > limit) {
      // Get the remaining TTL to tell the user when they can try again
      const ttl = await client.ttl(limitKey);
      const resetInSeconds = ttl > 0 ? ttl : windowSeconds;
      return { success: false, resetInSeconds };
    }

    return { success: true, resetInSeconds: 0 };
  } catch (error) {
    // If Redis is offline or crashes, fail open so we don't break the whole app
    if (error instanceof Error && error.message.includes("enableOfflineQueue")) {
      console.warn(`Redis offline. Rate limit bypassed. (${error.message})`);
    } else {
      console.error("Rate limit error, bypassing and allowing request:", error);
    }
    return { success: true, resetInSeconds: 0 };
  }
}
