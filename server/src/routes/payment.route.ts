import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    initializePaymentHandler,
    verifyPaymentHandler,
    webhookHandler,
    getPackagesHandler,
} from "../controllers/payment.controller";

const router: Router = Router();

router.get("/packages", getPackagesHandler);
router.post("/initialize", requireAuth, initializePaymentHandler);
router.get("/verify/:reference", requireAuth, verifyPaymentHandler);
router.post("/webhook", webhookHandler);

export default router;
