import type { NextFunction, Request, Response } from "express";
import { handleMissionError as handleError } from "../../error/error_handling";
import type { MissionService } from "./mission_services";

// Sesuaikan dengan bentuk req.user yang diisi middleware requireAuth
const getUserId = (req: Request): string => (req as any).user.userId;

export const MissionController = (missionService: MissionService) => ({
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quest = await missionService.create(getUserId(req), req.body);
      res.status(201).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await missionService.list(getUserId(req)));
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quest = await missionService.getDetail(
        req.params.questId as string,
        getUserId(req),
      );
      res.status(200).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quest = await missionService.update(
        req.params.questId as string,
        getUserId(req),
        req.body,
      );
      res.status(200).json(quest);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await missionService.remove(req.params.questId as string, getUserId(req));
      res.status(204).send();
    } catch (err) {
      handleError(err, res, next);
    }
  },
});
