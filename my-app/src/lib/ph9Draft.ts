import type { Ph9AnswerInput } from "@/lib/api";

const PH9_DRAFT_KEY = "sks.ph9.draft";

export function getPh9Draft(): Ph9AnswerInput[] {
  const stored = window.sessionStorage.getItem(PH9_DRAFT_KEY);
  if (!stored) return [];

  try {
    const draft: unknown = JSON.parse(stored);
    if (
      Array.isArray(draft) &&
      draft.every(
        (answer): answer is Ph9AnswerInput =>
          typeof answer === "object" &&
          answer !== null &&
          "questionId" in answer &&
          typeof answer.questionId === "string" &&
          "answerValue" in answer &&
          typeof answer.answerValue === "number",
      )
    ) {
      return draft;
    }
  } catch {
    window.sessionStorage.removeItem(PH9_DRAFT_KEY);
    return [];
  }

  window.sessionStorage.removeItem(PH9_DRAFT_KEY);
  return [];
}

export function savePh9Answer(answer: Ph9AnswerInput): void {
  const answers = getPh9Draft().filter((current) => current.questionId !== answer.questionId);
  answers.push(answer);
  window.sessionStorage.setItem(PH9_DRAFT_KEY, JSON.stringify(answers));
}

export function clearPh9Draft(): void {
  window.sessionStorage.removeItem(PH9_DRAFT_KEY);
}
