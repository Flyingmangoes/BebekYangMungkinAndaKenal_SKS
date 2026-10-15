import { z } from "zod";
import { PH9_MAX_ANSWER, PH9_MIN_ANSWER, PH9_QUESTION_COUNT } from "./ph9.scoring";

export const submitPh9Schema = z.strictObject({
  answers: z
    .array(
      z.strictObject({
        questionId: z.uuid(),
        answerValue: z.number().int().min(PH9_MIN_ANSWER).max(PH9_MAX_ANSWER),
      }),
    )
    .length(PH9_QUESTION_COUNT),
});

export const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.uuid().optional(),
});

export const submissionParamsSchema = z.object({
  submissionId: z.uuid(),
});

export type SubmitPh9Input = z.infer<typeof submitPh9Schema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;