import { z } from "zod";

export const createApiKeySchema = z.object({
    body: z.object({
        label: z.string().max(100).optional(),
    }),
});
