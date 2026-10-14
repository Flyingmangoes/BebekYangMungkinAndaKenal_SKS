import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";
import { ArticleController } from "./article.controllers";
import type { ArticleService } from "./article.services";
import {
  articleParamSchema,
  createArticleSchema,
  listArticleSchema,
  updateArticleSchema,
} from "./article.schema";

export function articleRouteFactory(service: ArticleService): Router {
  const router = Router();
  const ctrl = ArticleController(service);

  router.post("/",                     requireAuth, validate(createArticleSchema), ctrl.create);
  router.get("/",                                   validate(listArticleSchema),   ctrl.list);
  router.get("/:articleId",                         validate(articleParamSchema),  ctrl.detail);
  router.patch("/:articleId",          requireAuth, validate(updateArticleSchema), ctrl.update);
  router.delete("/:articleId",         requireAuth, validate(articleParamSchema),  ctrl.remove);

  router.post("/:articleId/like",      requireAuth, validate(articleParamSchema),  ctrl.like);
  router.post("/:articleId/save",      requireAuth, validate(articleParamSchema),  ctrl.save);
  router.post("/:articleId/share",     requireAuth, validate(articleParamSchema),  ctrl.share);

  return router;
}