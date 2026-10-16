import { z } from "zod";

const questIdParam = z.object({ questId: z.string().uuid() });

// userId sengaja tidak ada di sini: diambil dari user yang login (requireAuth)
// Quest hanya boleh berasal dari Gemini: service mencocokkan body dengan cache server.
export const createMissionSchema = z.object({
  body: z
    .object({
      questTitle: z.string().trim().min(1).max(200),
      questDescription: z.string().trim().min(1).max(1000),
    })
    .strict(), // client cannot send source, submissionId, progress
});

export const missionParamSchema = z.object({
  params: questIdParam,
});

export const updateMissionSchema = z.object({
  params: questIdParam,
  body: z
    .object({
      progress: z.number().int().min(0).max(100),
    })
    .strict(), // title and description are AI-owned: no edit
});

export type CreateMissionInput = z.infer<typeof createMissionSchema>["body"];
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>["body"];