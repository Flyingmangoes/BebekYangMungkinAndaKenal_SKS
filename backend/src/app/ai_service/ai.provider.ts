import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "./ai.prompt";
import type { GenerationInput } from "./ai.schema";

export interface QuestGenerator {
  generate(input: GenerationInput): Promise<unknown>;
}

export interface GeminiOptions {
  apiKey: string;
  model: string;
  timeoutMs: number;
}

// Lenient on purpose: it's the shape sent to Gemini. Strict limits are enforced
// afterwards by generatedQuestSetSchema in AIService.
const questSchema = z.object({ questTitle: z.string(), questDescription: z.string() });
const modelOutputSchema = z.object({
  low: z.array(questSchema),
  medium: z.array(questSchema),
  high: z.array(questSchema),
});

export class GeminiQuestGenerator implements QuestGenerator {
  private readonly google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor(private readonly opts: GeminiOptions) {
    this.google = createGoogleGenerativeAI({ apiKey: opts.apiKey });
  }

  async generate(input: GenerationInput): Promise<unknown> {
    const { output } = await generateText({
      model: this.google(this.opts.model),
      system: SYSTEM_INSTRUCTION,
      prompt: buildUserPrompt(input),
      output: Output.object({ schema: modelOutputSchema }),
      temperature: 0.7,
      maxOutputTokens: 2048,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(this.opts.timeoutMs),
    });
    return output;
  }
}