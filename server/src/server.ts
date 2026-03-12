import type { Application } from "express";
import express, { urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import globalErrorHandler from "./middlewares/global.error.handler";
import { disconnectRedis } from "./common/config/redis.config";
import logger from "./common/logger/logger";
import authRoutes from "./routes/auth.route";
import gmailRoutes from "./routes/gmail.route";
import smtpRoutes from "./routes/smtp.route";
import emailRoutes from "./routes/email.route";
import apiKeyRoutes from "./routes/api-key.route";
import userRoutes from "./routes/user.route";
import urlVersioning from "./middlewares/url.versioning";
import { requestLogger, addTimestamp } from "./middlewares/request.logger";
import { ipRateLimiter } from "./middlewares/rate-limiter";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.use(addTimestamp);

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(urlVersioning("v1"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/gmail", gmailRoutes);
app.use("/api/v1/smtp", smtpRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/keys", apiKeyRoutes);
app.use("/api/v1/users", userRoutes);

app.use(globalErrorHandler);

const startServer = async () => {
    const PORT = process.env.PORT || 8080;

    try {
        app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    } catch (error) {
        logger.error(`Failed to start server ${error}`);
        process.exit(1);
    }
};

startServer();

process.on("unhandledRejection", async (reason, promise) => {
    await disconnectRedis();
    console.error("unhandled rejection", promise, "reason:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error("uncaughtException", error);
    process.exit(1);
});
