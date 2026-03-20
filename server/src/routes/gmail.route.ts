import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    connectGmailHandler,
    gmailCallbackHandler,
    gmailStatusHandler,
    disconnectGmailHandler
} from "../controllers/gmail.controller";

const router: Router = Router();

router.get("/connect", requireAuth, connectGmailHandler);
router.get("/callback", gmailCallbackHandler);
router.get("/status", requireAuth, gmailStatusHandler);
router.delete("/disconnect", requireAuth, disconnectGmailHandler);

export default router;
