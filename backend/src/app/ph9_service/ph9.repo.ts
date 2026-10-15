import type {
  Ph9Question,
  Ph9Submission,
  Prisma,
  PrismaClient,
} from "../../generated/prisma/client";

export type Ph9QuestionView = Pick<Ph9Question, "questionId" | "questionIndex" | "questionBody">;

export interface NewPh9Answer {
  questionId: string;
  answerValue: number;
}

const SUBMISSION_WITH_ANSWERS = {
  answers: {
    select: { answerValue: true, question: { select: { questionIndex: true } } },
    orderBy: { question: { questionIndex: "asc" } },
  },
} satisfies Prisma.Ph9SubmissionInclude;

export type Ph9SubmissionWithAnswers = Prisma.Ph9SubmissionGetPayload<{
  include: typeof SUBMISSION_WITH_ANSWERS;
}>;

export interface Ph9RepositoryInterface {
  listQuestions(): Promise<Ph9QuestionView[]>;
  createSubmission(userId: string, totalScore: number, answers: NewPh9Answer[]): Promise<Ph9Submission>;
  listSubmissions(userId: string, take: number, cursor?: string): Promise<Ph9Submission[]>;
  findSubmission(userId: string, submissionId: string): Promise<Ph9SubmissionWithAnswers | null>;
}

export class Ph9Repository implements Ph9RepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  async listQuestions(): Promise<Ph9QuestionView[]> {
    return this.db.ph9Question.findMany({
      select: { questionId: true, questionIndex: true, questionBody: true },
      orderBy: { questionIndex: "asc" },
    });
  }

  // Nested write: the submission and its answers are saved atomically.
  async createSubmission(
    userId: string,
    totalScore: number,
    answers: NewPh9Answer[],
  ): Promise<Ph9Submission> {
    return this.db.ph9Submission.create({
      data: { userId, totalScore, answers: { createMany: { data: answers } } },
    });
  }

  async listSubmissions(userId: string, take: number, cursor?: string): Promise<Ph9Submission[]> {
    return this.db.ph9Submission.findMany({
      where: { userId },
      orderBy: [{ submittedAt: "desc" }, { submissionId: "desc" }],
      take,
      ...(cursor ? { cursor: { submissionId: cursor }, skip: 1 } : {}),
    });
  }

  // userId is part of the WHERE: someone else's submission looks exactly like a missing one.
  async findSubmission(userId: string, submissionId: string): Promise<Ph9SubmissionWithAnswers | null> {
    return this.db.ph9Submission.findFirst({
      where: { submissionId, userId },
      include: SUBMISSION_WITH_ANSWERS,
    });
  }
}