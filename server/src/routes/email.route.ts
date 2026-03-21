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

router.post("/send", ipRateLimiter, requireApiKey, apiSendRateLimiter, validateResource(sendEmailSchema), sendEmailHandler);
router.get("/logs", requireAuth, getEmailLogsHandler);
router.get("/scheduled", requireAuth, getScheduledEmailsHandler);
router.delete("/scheduled/:id", requireAuth, cancelScheduledEmailHandler);
router.patch("/scheduled/:id/reschedule", requireAuth, rescheduleEmailHandler);
router.post("/batch", ipRateLimiter, requireApiKey, apiSendRateLimiter, sendBatchEmailHandler);
router.get("/batch", requireAuth, getBatchJobsHandler);
router.get("/batch/:id", requireAuth, getBatchJobHandler);
router.delete("/batch/:id", requireAuth, cancelBatchJobHandler);

export default router;