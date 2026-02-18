
import type { Application } from "express";
import express, { urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import globalErrorHandler from "./middlewares/global.error.handler"
import { disconnectRedis } from "./common/config/redis.config"
import logger from "./common/logger/logger";

const app: Application = express()

app.use(helmet());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(globalErrorHandler)


const startServer = async () => {
  const PORT = process.env.PORT || 8080

  try {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
  } catch (error) {
    logger.error(`Failed to start server ${error}`)
    process.exit(1)
  }
}

startServer()

process.on("unhandledRejection", async (reason, promise) => {
  await disconnectRedis()
  console.error("unhandled rejection", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error)
  process.exit(1)
})

