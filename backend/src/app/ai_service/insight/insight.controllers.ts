import type { NextFunction, Request, Response } from "express";
import { SuggestionError } from "../../../error/exception";
import type { SuggestionErrorCode } from "../../../error/exception";
import { questionsQuerySchema } from "../../ph9_service/ph9.schema";
import type { InsightService } from "./insight.services";

// Reuses SuggestionError: no new error codes, so exception.ts stays untouched.
const ERROR_RESPONSES: Partial<Record<SuggestionErrorCode, { status: number; message: string }>> = {
  INVALID_INPUT: { status: 400, message: "Invalid request" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  PH9_REQUIRED: { status: 409, message: "Complete the PH9 questionnaire first" },
};

// userId comes from the verified token and nowhere else.
const userIdOf = (req: Request): string => {
  const userId = req.authUser?.userId;
  if (!userId) throw new SuggestionError("UNAUTHORIZED");
  return userId;
};

const fail = (err: unknown, res: Response, next: NextFunction): void => {
  if (err instanceof SuggestionError) {
    const mapped = ERROR_RESPONSES[err.code];
    if (mapped) {
      res.status(mapped.status).json({ code: err.code, message: mapped.message });
      return;
    }
  }
  next(err);
};

export const InsightController = (service: InsightService) => ({
  async current(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = userIdOf(req);
      const query = questionsQuerySchema.safeParse(req.query);
      if (!query.success) throw new SuggestionError("INVALID_INPUT");

      res.set("Cache-Control", "no-store").json(await service.getCurrent(userId, query.data.lang));
    } catch (err) {
      fail(err, res, next);
    }
  },
});