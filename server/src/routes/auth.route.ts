import { Router } from "express";
import { githubRedirectHandler, githubCallbackHandler, logoutHandler } from "../controllers/auth.controller";

const router: Router = Router();

router.get("/github", githubRedirectHandler);
router.get("/github/callback", githubCallbackHandler);
router.post("/logout", logoutHandler);

export default router;