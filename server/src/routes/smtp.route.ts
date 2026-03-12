import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateResource } from "../middlewares/validate.resource";
import { smtpConfigSchema } from "../common/validations/smtp.schema";
import {
    saveSmtpConfigHandler,
    getSmtpConfigHandler,
    deleteSmtpConfigHandler,
    testSmtpHandler
} from "../controllers/smtp.controller";

const router: Router = Router();

// POST /api/v1/smtp/config - save SMTP config
router.post("/config", requireAuth, validateResource(smtpConfigSchema), saveSmtpConfigHandler);

// GET /api/v1/smtp/config - get SMTP config (without password)
router.get("/config", requireAuth, getSmtpConfigHandler);

// DELETE /api/v1/smtp/config - delete SMTP config
router.delete("/config", requireAuth, deleteSmtpConfigHandler);

// POST /api/v1/smtp/test - test SMTP connection
router.post("/test", requireAuth, testSmtpHandler);

export default router;
