import { Ph9Error } from "../../error/exception";
import { Ph9Repository } from "./ph9.repo";
import type { Ph9QuestionView } from "./ph9.repo";
import {
    PH9_QUESTION_COUNT,
    calculatePH9Result,
    severityFor,
} from "./ph9.scoring";

import type { PH9Result, PH9Severity, ScoredAnswer } from "./ph9.scoring";
import type { HistoryQueryInput, Ph9Language, SubmitPh9Input } from "./ph9.schema";

export interface Ph9SubmissionResult extends PH9Result {
    submissionId: string;
    submittedAt: Date;
}

export interface Ph9SubmissionDetail extends Ph9SubmissionResult {
    answers: ScoredAnswer[];
}

export interface Ph9HistoryItem {
    submissionId: string;
    totalScore: number;
    severity: PH9Severity;
    submittedAt: Date;
}

export interface Ph9HistoryPage {
    items: Ph9HistoryItem[];
    nextCursor: string | null;
}

export class Ph9Service {
    constructor(private readonly ph9Repo: Ph9Repository) {}

    async getQuestions(language: Ph9Language): Promise<Ph9QuestionView[]> {
        const questions = await this.ph9Repo.listQuestions(language);
        if (questions.length !== PH9_QUESTION_COUNT) {
            throw new Error(`PH9 questions are not fully seeded for language "${language}"`);
        }
        return questions;
    }

    async submit(userId: string, input: SubmitPh9Input): Promise<Ph9SubmissionResult> {
        const language = input.language;
        if (language !== "id" && language !== "en") {
            throw new Ph9Error("INVALID_INPUT");
        }
        const questions = await this.ph9Repo.listQuestions(language);
        if (questions.length !== PH9_QUESTION_COUNT) {
            throw new Error("PH9 questions are not seeded correctly");
        }

        const indexById = new Map(questions.map((q) => [q.questionId, q.questionIndex]));

        // Every question answered exactly once. Value range is already enforced by the schema.
        const seen = new Set<string>();
        const scored: ScoredAnswer[] = [];
        for (const answer of input.answers) {
            const questionIndex = indexById.get(answer.questionId);
            if (questionIndex === undefined || seen.has(answer.questionId)) {
                throw new Ph9Error("INVALID_INPUT");
            }
            seen.add(answer.questionId);
            scored.push({ questionIndex, answerValue: answer.answerValue });
        }
        if (seen.size !== questions.length) throw new Ph9Error("INVALID_INPUT");

        // The server computes the score. The client never sends one.
        const result = calculatePH9Result(scored);
        const submission = await this.ph9Repo.createSubmission(userId, result.totalScore, input.answers);

        return { submissionId: submission.submissionId, submittedAt: submission.submittedAt, ...result };
    }

    async getHistory(userId: string, query: HistoryQueryInput): Promise<Ph9HistoryPage> {
        const rows = await this.ph9Repo.listSubmissions(userId, query.limit + 1, query.cursor); // +1 detects a next page
        const page = rows.slice(0, query.limit);
        return {
            items: page.map((r) => ({
                submissionId: r.submissionId,
                totalScore: r.totalScore,
                severity: severityFor(r.totalScore),
                submittedAt: r.submittedAt,
        })),
            nextCursor: rows.length > query.limit ? page[page.length - 1].submissionId : null,
        };
    }

    async getSubmission(userId: string, submissionId: string): Promise<Ph9SubmissionDetail> {
        const submission = await this.ph9Repo.findSubmission(userId, submissionId);
        if (!submission) throw new Ph9Error("SUBMISSION_NOT_FOUND");

        const answers = submission.answers.map((a) => ({
            questionIndex: a.question.questionIndex,
            answerValue: a.answerValue,
        }));
        return {
            submissionId: submission.submissionId,
            submittedAt: submission.submittedAt,
            ...calculatePH9Result(answers), // recomputed from the answers, so selfHarmFlag is always correct
            answers,
        };
    }
}