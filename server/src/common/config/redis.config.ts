import Redis from "ioredis";
import logger from "../logger/logger";

const { REDIS_PORT, REDIS_PASSWORD, REDIS_HOST } = process.env


if (!REDIS_PORT || !REDIS_HOST) {
    throw new Error("Redis Connection Url is missing")
}

const redis = new Redis({
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD,
    db: 0,
    host: REDIS_HOST,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 5000)
        logger.warn(`Retrying Redis connection in ${delay}ms`)
        return delay
    },
    maxRetriesPerRequest: null,
})

redis.on("connect", () => logger.info("Connected to Redis"))
redis.on("error", (err) => console.error("Redis Error:", err))
// i personally used console error here instead of pino.. becuase pino does not print full complete erro rto the console only half of it..
redis.on("close", () => logger.warn("Redis Connection Closed"))


const disconnectRedis = async () => {
    await redis.quit()
    logger.info("Redis Disconnected Gracefully")
}

export { redis, disconnectRedis }
