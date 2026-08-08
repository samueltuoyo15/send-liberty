import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

const sendLimiterFree = new RateLimiterMemory({ points: 30, duration: 60, keyPrefix: "rl_send" });
const sendLimiterPro = new RateLimiterMemory({ points: 300, duration: 60, keyPrefix: "rl_send_pro" });
const authLimiter = new RateLimiterMemory({ points: 10, duration: 60, keyPrefix: "rl_auth" });

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
  const limiter =
    type === "send"
      ? plan === "pro"
        ? sendLimiterPro
        : sendLimiterFree
      : authLimiter;

  try {
    await limiter.consume(key);
    return { success: true, resetInSeconds: 0 };
  } catch (res: unknown) {
    if (res instanceof RateLimiterRes) {
      const resetInSeconds = Math.ceil(res.msBeforeNext / 1000) || 1;
      return { success: false, resetInSeconds };
    }
    console.error("Rate limit error, allowing request:", res);
    return { success: true, resetInSeconds: 0 };
  }
}
