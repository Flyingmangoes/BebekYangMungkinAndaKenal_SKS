import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const LANGUAGES = ["en", "id"] as const;
type Language = (typeof LANGUAGES)[number];

interface QuestionSeed {
  questionIndex: number;
  questionBody: string;
}
type SeedFile = Record<Language, QuestionSeed[]>;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const clean = (text: string): string => text.replace(/\s+/g, " ").trim();

const loadSeed = (): SeedFile => {
  const file = join(process.cwd(), "prisma", "ph9_questions.json");
  const data: SeedFile = JSON.parse(readFileSync(file, "utf-8"));

  for (const language of LANGUAGES) {
    const items = data[language];
    const valid =
      Array.isArray(items) &&
      items.length === 9 &&
      items.every((q, i) => q.questionIndex === i + 1 && clean(q.questionBody) !== "");
    if (!valid) throw new Error(`"${language}" must have 9 non-empty items numbered 1 to 9`);
  }
  return data;
};

async function main(): Promise<void> {
  const data = loadSeed();

  await prisma.$transaction(async (tx) => {
    const txClient = tx as any;

    for (let questionIndex = 1; questionIndex <= 9; questionIndex++) {
      const question = await txClient.ph9Question.upsert({
        where: { questionIndex },
        update: {},
        create: { questionIndex },
      });

      for (const language of LANGUAGES) {
        const questionBody = clean(data[language][questionIndex - 1].questionBody);
        await txClient.ph9QuestionTranslation.upsert({
          where: { questionId_language: { questionId: question.questionId, language } },
          update: { questionBody },
          create: { questionId: question.questionId, language, questionBody },
        });
      }
    }
  });
  console.log("Seeded 9 PH9 questions in:", LANGUAGES.join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());