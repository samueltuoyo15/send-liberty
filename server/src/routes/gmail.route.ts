import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    connectGmailHandler,
    gmailCallbackHandler,
    gmailStatusHandler,
    disconnectGmailHandler
} from "../controllers/gmail.controller";

const router: Router = Router();

// GET /api/v1/gmail/connect - get auth URL (requires dashboard auth)
router.get("/connect", requireAuth, connectGmailHandler);

// GET /api/v1/gmail/callback - OAuth callback from Google (no auth required, state contains userId)
router.get("/callback", gmailCallbackHandler);

// GET /api/v1/gmail/status - check if Gmail is connected
router.get("/status", requireAuth, gmailStatusHandler);

// DELETE /api/v1/gmail/disconnect - disconnect Gmail
router.delete("/disconnect", requireAuth, disconnectGmailHandler);

export default router;
