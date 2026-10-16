import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { INSIGHT_SYSTEM_INSTRUCTION, buildInsightPrompt } from "./ai.insight.prompt";
import type { GeminiOptions } from "./ai.provider";
import type { GenerationInput } from "./ai.schema";

export interface InsightGenerator {
  generate(input: GenerationInput): Promise<unknown>;
}

// Lenient on purpose: strict limits are enforced afterwards by generatedInsightSchema.
const modelOutputSchema = z.object({
  summary: z.string(),
  tips: z.array(z.string()),
});

export class GeminiInsightGenerator implements InsightGenerator {
  private readonly google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor(private readonly opts: GeminiOptions) {
    this.google = createGoogleGenerativeAI({ apiKey: opts.apiKey });
  }

  async generate(input: GenerationInput): Promise<unknown> {
    const { output } = await generateText({
      model: this.google(this.opts.model),
      system: INSIGHT_SYSTEM_INSTRUCTION,
      prompt: buildInsightPrompt(input),
      output: Output.object({ schema: modelOutputSchema }),
      temperature: 0.5,
      maxOutputTokens: 1024,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(this.opts.timeoutMs),
    });
    return output;
  }
}