import { Router } from "express";
import { requireApiKey } from "../middlewares/api-key.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateResource } from "../middlewares/validate.resource";
import { sendEmailSchema } from "../common/validations/email.schema";
import {
    sendEmailHandler,
    getEmailLogsHandler,
    getScheduledEmailsHandler,
    cancelScheduledEmailHandler,
    rescheduleEmailHandler,
    sendBatchEmailHandler,
    getBatchJobsHandler,
    getBatchJobHandler,
    cancelBatchJobHandler,
} from "../controllers/email.controller";
import { apiSendRateLimiter, ipRateLimiter } from "../middlewares/rate-limiter";

const router: Router = Router();

// Immediate / scheduled single email (API key auth)
router.post("/send", ipRateLimiter, requireApiKey, apiSendRateLimiter, validateResource(sendEmailSchema), sendEmailHandler);

// Email logs (user session auth)
router.get("/logs", requireAuth, getEmailLogsHandler);

// Scheduled email management
router.get("/scheduled", requireAuth, getScheduledEmailsHandler);
router.delete("/scheduled/:id", requireAuth, cancelScheduledEmailHandler);
router.patch("/scheduled/:id/reschedule", requireAuth, rescheduleEmailHandler);

// Batch email management
router.post("/batch", requireAuth, sendBatchEmailHandler);
router.get("/batch", requireAuth, getBatchJobsHandler);
router.get("/batch/:id", requireAuth, getBatchJobHandler);
router.delete("/batch/:id", requireAuth, cancelBatchJobHandler);

export default router;

