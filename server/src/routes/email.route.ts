import { Router } from "express";
import { requireApiKey } from "../middlewares/api-key.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateResource } from "../middlewares/validate.resource";
import { sendEmailSchema } from "../common/validations/email.schema";
import { sendEmailHandler, getEmailLogsHandler } from "../controllers/email.controller";
import { apiSendRateLimiter, ipRateLimiter } from "../middlewares/rate-limiter";

const router: Router = Router();

router.post("/send", ipRateLimiter, requireApiKey, apiSendRateLimiter, validateResource(sendEmailSchema), sendEmailHandler);

router.get("/logs", requireAuth, getEmailLogsHandler);

export default router;
