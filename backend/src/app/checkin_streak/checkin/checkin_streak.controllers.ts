import type { NextFunction, Request, Response } from "express";
import type { CheckinService } from "./checkin.services";
import { AuthError } from "../../../error/exception";
import { historySchema } from "./checkin_streak.schema";

// asumsi: requireAuth mengisi req.user = { userId, username, role }
const userIdOf = (req: Request): string => (req as Request & { user: { userId: string } }).user.userId;

export const CheckinController = (checkinService: CheckinService) => ({
  async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await checkinService.checkIn(userIdOf(req));
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.code === "ALREADY_CHECKED_IN") {
          res.status(409).json({ message: "Already checked in today" });
          return;
        }
        if (err.code === "USER_NOT_FOUND") {
          res.status(404).json({ message: "User not found" });
          return;
        }
      }
      next(err);
    }
  },

  async streak(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const streak = await checkinService.getStreak(userIdOf(req));
      res.json(streak);
    } catch (err) {
      if (err instanceof AuthError && err.code === "USER_NOT_FOUND") {
        res.status(404).json({ message: "User not found" });
        return;
      }
      next(err);
    }
  },

  async history(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = historySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid query" });
        return;
      }
      const items = await checkinService.getHistory(userIdOf(req), parsed.data.limit);
      res.json(items);
    } catch (err) {
      next(err);
    }
  },
});