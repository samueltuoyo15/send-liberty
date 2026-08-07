import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL!, {
      db: 0, // Zeabur default Redis doesn't support multiple DBs
      keyPrefix: "sendlib_",
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      enableOfflineQueue: false,
      retryStrategy: (times) => {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });
    client.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
    client.on("close", () => {
      client = null;
    });
    client.on("end", () => {
      client = null;
    });
  }
  return client;
}
