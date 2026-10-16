import type { NextFunction, Request, Response } from "express";
import type { CheckinService } from "./checkin.services";
import { AuthError } from "../../../error/exception";
import { historySchema } from "./checkin.streak.schema";

const getUserId = (req: Request): string | undefined => req.authUser?.userId;

export const CheckinController = (checkinService: CheckinService) => ({
  async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const result = await checkinService.checkIn(userId);
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
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const streak = await checkinService.getStreak(userId);
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

      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const items = await checkinService.getHistory(userId, parsed.data.limit);
      res.json(items);
    } catch (err) {
      next(err);
    }
  },
});