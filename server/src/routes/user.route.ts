import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getMeHandler, updateMeHandler, switchModeHandler } from "../controllers/user.controller";

const router: Router = Router();

router.get("/me", requireAuth, getMeHandler);
router.patch("/me", requireAuth, updateMeHandler);
router.patch("/mode", requireAuth, switchModeHandler);

export default router;
