import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateResource } from "../middlewares/validate.resource";
import { createApiKeySchema } from "../common/validations/api-key.schema";
import {
  generateApiKeyHandler,
  listApiKeysHandler,
  revokeApiKeyHandler,
  deleteApiKeyHandler,
} from "../controllers/api-key.controller";

const router: Router = Router();

router.post(
  "/",
  requireAuth,
  validateResource(createApiKeySchema),
  generateApiKeyHandler,
);

router.get("/", requireAuth, listApiKeysHandler);

router.patch("/:id/revoke", requireAuth, revokeApiKeyHandler);

router.delete("/:id", requireAuth, deleteApiKeyHandler);

export default router;
