import { Router } from "express";
import { signupHandler, loginController } from "../controllers/auth.controller";
import { validateResource } from "../middlewares/validate.resource";
import { signupSchema, loginSchema } from "../common/validations/auth.schema";

const router: Router = Router();

router.post("/signup", validateResource(signupSchema), signupHandler);
router.post("/login", validateResource(loginSchema), loginController);

export default router;