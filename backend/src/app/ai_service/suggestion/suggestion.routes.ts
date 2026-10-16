import { Router } from "express";
import type { RequestHandler } from "express";
import type { SuggestionController } from "./suggestion.controllers";

export interface SuggestionRouterDeps {
  controller: ReturnType<typeof SuggestionController>;
  requireAuth: RequestHandler;
  refreshLimiter: RequestHandler;
}

export const createSuggestionRouter = ({
  controller,
  requireAuth,
  refreshLimiter,
}: SuggestionRouterDeps): Router => {
  const router = Router();

  router.get("/quests", requireAuth, controller.current);
  router.post("/quests/refresh", requireAuth, refreshLimiter, controller.refresh);

  return router;
};