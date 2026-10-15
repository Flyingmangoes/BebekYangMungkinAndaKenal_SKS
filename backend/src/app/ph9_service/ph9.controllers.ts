import type { NextFunction, Request, Response } from "express";
import { Ph9Error } from "../../error/exception";
import type { Ph9ErrorCode } from "../../error/exception";
import type { Ph9Service } from "./ph9.services.ts";
import { historyQuerySchema, submissionParamsSchema } from "./ph9.schema";

const ERROR_RESPONSES: Record<Ph9ErrorCode, { status: number; message: string }> = {
    INVALID_INPUT: { status: 400, message: "Invalid request" },
    UNAUTHORIZED: { status: 401, message: "Unauthorized" },
    SUBMISSION_NOT_FOUND: { status: 404, message: "Submission not found" },
};

// userId comes from the verified token and nowhere else.
const userIdOf = (req: Request): string => {
    const userId = req.authUser?.userId;
    if (!userId) throw new Ph9Error("UNAUTHORIZED");
    return userId;
};

const fail = (err: unknown, res: Response, next: NextFunction): void => {
    if (err instanceof Ph9Error) {
        const { status, message } = ERROR_RESPONSES[err.code];
        res.status(status).json({ message });
        return;
    }
    next(err);
};

export const Ph9Controller = (ph9Service: Ph9Service) => ({
    async getQuestions(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json({ questions: await ph9Service.getQuestions() });
        } catch (err) {
            fail(err, res, next);
        }
    },

    async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await ph9Service.submit(userIdOf(req), req.body); // body checked by validate middleware
            res.set("Cache-Control", "no-store").status(201).json(result);
        } catch (err) {
            fail(err, res, next);
        }
    },

    async listSubmissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = userIdOf(req);
            const query = historyQuerySchema.safeParse(req.query);
            if (!query.success) throw new Ph9Error("INVALID_INPUT");

            const page = await ph9Service.getHistory(userId, query.data);
            res.set("Cache-Control", "no-store").json(page);
        } catch (err) {
            fail(err, res, next);
        }
    },

    async getSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = userIdOf(req);
            const params = submissionParamsSchema.safeParse(req.params);
            if (!params.success) throw new Ph9Error("INVALID_INPUT");

            const submission = await ph9Service.getSubmission(userId, params.data.submissionId);
            res.set("Cache-Control", "no-store").json(submission);
        } catch (err) {
            fail(err, res, next);
        }
    },
});