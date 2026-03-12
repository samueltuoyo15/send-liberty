import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateResource } from "../middlewares/validate.resource";
import { createApiKeySchema } from "../common/validations/api-key.schema";
import {
    generateApiKeyHandler,
    listApiKeysHandler,
    revokeApiKeyHandler,
    deleteApiKeyHandler
} from "../controllers/api-key.controller";

const router: Router = Router();

// POST /api/v1/keys - generate a new API key
router.post("/", requireAuth, validateResource(createApiKeySchema), generateApiKeyHandler);

// GET /api/v1/keys - list all API keys for user
router.get("/", requireAuth, listApiKeysHandler);

// PATCH /api/v1/keys/:id/revoke - revoke an API key
router.patch("/:id/revoke", requireAuth, revokeApiKeyHandler);

// DELETE /api/v1/keys/:id - delete an API key
router.delete("/:id", requireAuth, deleteApiKeyHandler);

export default router;
