import { Router } from "express";
import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { Ph9Controller } from "./ph9.controllers";
import { submitPh9Schema } from "./ph9.schema";

export interface Ph9RouterDeps {
    controller: ReturnType<typeof Ph9Controller>;
    requireAuth: RequestHandler;
    submitLimiter: RequestHandler;
    validate: (schema: ZodType) => RequestHandler;
}

export const createPh9Router = ({ controller, requireAuth, submitLimiter, validate }: Ph9RouterDeps): Router => {
    const router = Router();

    router.get("/questions", controller.getQuestions);
    router.post("/submissions", requireAuth, submitLimiter, validate(submitPh9Schema), controller.submit);
    router.get("/submissions", requireAuth, controller.listSubmissions);
    router.get("/submissions/:submissionId", requireAuth, controller.getSubmission);

    return router;
};