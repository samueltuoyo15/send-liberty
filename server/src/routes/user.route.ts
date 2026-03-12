import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getMeHandler, updateMeHandler, switchModeHandler } from "../controllers/user.controller";

const router: Router = Router();

// GET /api/v1/users/me - get current user profile
router.get("/me", requireAuth, getMeHandler);

// PATCH /api/v1/users/me - update display name, avatar, default reply-to
router.patch("/me", requireAuth, updateMeHandler);

// PATCH /api/v1/users/mode - switch between test_mode and live_mode
router.patch("/mode", requireAuth, switchModeHandler);

export default router;
