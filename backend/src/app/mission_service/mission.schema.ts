import { z } from "zod";

const questIdParam = z.object({ questId: z.string().uuid() });

// userId sengaja tidak ada di sini: diambil dari user yang login (requireAuth)
export const createMissionSchema = z.object({
  body: z.object({
    questTitle: z.string().trim().min(1).max(200),
    questDescription: z.string().trim().min(1).max(1000),
    progress: z.number().int().min(0).max(100).optional(),
  }),
});

export const missionParamSchema = z.object({
  params: questIdParam,
});

export const updateMissionSchema = z.object({
  params: questIdParam,
  body: z
    .object({
      questTitle: z.string().trim().min(1).max(200).optional(),
      questDescription: z.string().trim().min(1).max(1000).optional(),
      progress: z.number().int().min(0).max(100).optional(),
    })
    .strict()
    .refine((v) => Object.keys(v).length > 0, {
      message: "At least one field must be provided",
    }),
});

export type CreateMissionInput = z.infer<typeof createMissionSchema>["body"];
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>["body"];
