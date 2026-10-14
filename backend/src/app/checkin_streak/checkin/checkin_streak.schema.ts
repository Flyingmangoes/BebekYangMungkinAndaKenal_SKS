import { z } from "zod";

// POST check-in tidak punya body: model CheckIn hanya menyimpan tanggal.
export const historySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type HistoryQuery = z.infer<typeof historySchema>;