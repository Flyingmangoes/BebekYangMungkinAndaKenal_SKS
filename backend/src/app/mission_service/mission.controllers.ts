import type { NextFunction, Request, Response } from "express";
import { handleMissionError as handleError } from "../../error/error_handling";
import type { MissionService } from "./mission.services";

const getUserId = (req: Request): string | undefined => req.authUser?.userId;

export const MissionController = (missionService: MissionService) => ({
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const quest = await missionService.create(userId, req.body);
      res.status(201).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      res.status(200).json(await missionService.list(userId));
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const quest = await missionService.getDetail(
        req.params.questId as string,
        userId,
      );
      res.status(200).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      const quest = await missionService.update(
        req.params.questId as string,
        userId,
        req.body,
      );
      res.status(200).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req)
      if(!userId) {
          res.status(401).json("Not authenticated")
          return
      }

      await missionService.remove(req.params.questId as string, userId);
      res.status(204).send();
    } catch (err) {
      handleError(err, res, next);
    }
  },
});
