export const PH9_MIN_ANSWER = 0;
export const PH9_MAX_ANSWER = 3;
export const PH9_SELF_HARM_QUESTION_INDEX = 9;
export const PH9_QUESTION_COUNT = 9;

export type PH9Severity =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately_severe"
  | "severe";

export interface ScoredAnswer {
  questionIndex: number;
  answerValue: number;
}

export interface PH9Result {
  totalScore: number;
  severity: PH9Severity;
  selfHarmFlag: boolean;
}

export const severityFor = (totalScore: number): PH9Severity => {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  if (totalScore <= 19) return "moderately_severe";
  return "severe";
};

export const calculatePH9Result = (answers: ScoredAnswer[]): PH9Result => {
  const totalScore = answers.reduce((sum, a) => sum + a.answerValue, 0);
  const selfHarmFlag = answers.some(
    (a) => a.questionIndex === PH9_SELF_HARM_QUESTION_INDEX && a.answerValue > PH9_MIN_ANSWER,
  );
  return { totalScore, severity: severityFor(totalScore), selfHarmFlag };
};