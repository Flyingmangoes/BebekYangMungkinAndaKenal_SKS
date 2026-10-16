import type { NextFunction, Request, Response } from "express";
import { SuggestionError } from "../../../error/exception";
import type { SuggestionErrorCode } from "../../../error/exception";
import { questionsQuerySchema } from "../../ph9_service/ph9.schema";
import type { QuestSuggestionService } from "./suggestion.services";

const ERROR_RESPONSES: Record<SuggestionErrorCode, { status: number; message: string }> = {
  INVALID_INPUT: { status: 400, message: "Invalid request" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  PH9_REQUIRED: { status: 409, message: "Complete the PH9 questionnaire first" },
  REFRESH_TOO_SOON: { status: 429, message: "Please wait before refreshing again" },
};

// userId comes from the verified token and nowhere else.
const userIdOf = (req: Request): string => {
  const userId = req.authUser?.userId;
  if (!userId) throw new SuggestionError("UNAUTHORIZED");
  return userId;
};

const fail = (err: unknown, res: Response, next: NextFunction): void => {
  if (err instanceof SuggestionError) {
    const { status, message } = ERROR_RESPONSES[err.code];
    if (err.retryAfterMs) res.set("Retry-After", String(Math.ceil(err.retryAfterMs / 1000)));
    res.status(status).json({ code: err.code, message });
    return;
  }
  next(err);
};

export const SuggestionController = (service: QuestSuggestionService) => ({
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

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = userIdOf(req);
      const query = questionsQuerySchema.safeParse(req.query);
      if (!query.success) throw new SuggestionError("INVALID_INPUT");

      res.set("Cache-Control", "no-store").json(await service.refresh(userId, query.data.lang));
    } catch (err) {
      fail(err, res, next);
    }
  },
});