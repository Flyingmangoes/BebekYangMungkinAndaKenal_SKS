import { config } from "../src/config/config";
import { GeminiQuestGenerator } from "../src/app/ai_service/ai.provider";
import { AIService } from "../src/app/ai_service/ai.services";

const apiKey = config.AI.geminiApiKey;
if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

const generator = new GeminiQuestGenerator({
    apiKey,
    model: config.AI.model,
    timeoutMs: config.AI.timeoutMs,
});
const ai = new AIService(generator, { warn: (message, meta) => console.warn(message, meta) });

const start = Date.now();
ai.planQuests({
  severity: "moderate",
  selfHarmFlag: false,
  language: "id",
  energyLevel: "low",
  focusAreas: ["sleep", "mood"],
  count: 3,
}).then((plan) => {
  console.log(`took ${Date.now() - start} ms`);
  console.log(JSON.stringify(plan, null, 2));
});