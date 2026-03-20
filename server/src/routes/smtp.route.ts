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

router.post("/config", requireAuth, validateResource(smtpConfigSchema), saveSmtpConfigHandler);
router.get("/config", requireAuth, getSmtpConfigHandler);
router.delete("/config", requireAuth, deleteSmtpConfigHandler);
router.post("/test", requireAuth, testSmtpHandler);

export default router;
