import Redis from "ioredis";

let client: Redis | null = null;

export function connectToRedis(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL!, {
      db: 0,
      keyPrefix: "sendlib_",
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      commandTimeout: 2000,
      retryStrategy: (times) => {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });
    client.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  }
  return client;
}
