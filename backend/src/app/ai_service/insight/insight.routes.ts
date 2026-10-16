import { Router } from "express";
import type { RequestHandler } from "express";
import type { InsightController } from "./insight.controllers";

export interface InsightRouterDeps {
  controller: ReturnType<typeof InsightController>;
  requireAuth: RequestHandler;
  insightLimiter: RequestHandler; // each cache miss costs one Gemini call
}

export const createInsightRouter = ({
  controller,
  requireAuth,
  insightLimiter,
}: InsightRouterDeps): Router => {
  const router = Router();

  router.get("/insight", requireAuth, insightLimiter, controller.current);

  return router;
};