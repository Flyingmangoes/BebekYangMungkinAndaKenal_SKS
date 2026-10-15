import { Router } from "express";
import { requireAuth, requirePermission, requireRole } from "../../../middlewares/auth";
import { CheckinController } from "./checkin_streak.controllers";
import type { CheckinService } from "./checkin.services";

export function checkinRouteFactory(service: CheckinService): Router {
  const router = Router();
  const controller = CheckinController(service);

  router.post(
    "/",
    requireAuth,
    requireRole("user"),
    requirePermission("checkin", "create"),
    controller.checkIn,
  );
  router.get(
    "/streak",
    requireAuth,
    requireRole("user"),
    requirePermission("streak", "read"),
    controller.streak,
  );
  router.get(
    "/history",
    requireAuth,
    requireRole("user"),
    requirePermission("checkin", "read"),
    controller.history,
  );

  return router;
}