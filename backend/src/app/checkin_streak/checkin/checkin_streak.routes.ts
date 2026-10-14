import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth";
import { CheckinController } from "./checkin_streak.controllers";
import type { CheckinService } from "./checkin.services";

export function checkinRouteFactory(service: CheckinService): Router {
  const router = Router();
  const ctrl = CheckinController(service);

  router.post("/",       requireAuth, ctrl.checkIn);
  router.get("/streak",  requireAuth, ctrl.streak);
  router.get("/history", requireAuth, ctrl.history);

  return router;
}