import { z } from "zod";
import { PH9_MAX_ANSWER, PH9_MIN_ANSWER, PH9_QUESTION_COUNT } from "./ph9.scoring";

export const PH9_LANGUAGES = ["en", "id"] as const;
export type Ph9Language = (typeof PH9_LANGUAGES)[number];

export const questionsQuerySchema = z.object({
  lang: z.enum(PH9_LANGUAGES).default("id"),
});

export const submitPh9Schema = z.strictObject({
  language: z.string(),
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