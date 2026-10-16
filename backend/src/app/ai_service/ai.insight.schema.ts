import { z } from "zod";

export const INSIGHT_TIPS_COUNT = 3;

// Strict limits enforced after Gemini answers. Short text is easier to read.
export const generatedInsightSchema = z.strictObject({
  summary: z.string().trim().min(20).max(500),
  tips: z.array(z.string().trim().min(10).max(200)).length(INSIGHT_TIPS_COUNT),
});

export type GeneratedInsight = z.infer<typeof generatedInsightSchema>;
export type InsightSource = "ai" | "fallback";

export type InsightPlan =
  | { kind: "insight"; source: InsightSource; insight: GeneratedInsight }
  | { kind: "crisis" };