import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL!, {
      db: parseInt(process.env.REDIS_DB ?? "1", 10),
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      enableOfflineQueue: false,
    });
    client.on("error", (err) => {
      console.error("[Redis] connection error:", err.message);
    });
  }
  return client;
}
