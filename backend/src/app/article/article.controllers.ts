import type { NextFunction, Request, Response } from "express";
import { handleArticleError as handleError } from "../../error/error_handling";
import type { ArticleService } from "./article.services";

// Sesuaikan dengan bentuk req.user yang diisi middleware requireAuth
const getUserId = (req: Request): string => (req as any).user.userId;

export const ArticleController = (articleService: ArticleService) => ({
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await articleService.create(getUserId(req), req.body);
      res.status(201).json(article);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      res.status(200).json(await articleService.list(page, limit));
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res
        .status(200)
        .json(await articleService.getDetail(req.params.articleId as string));
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await articleService.update(
        req.params.articleId as string,
        getUserId(req),
        req.body,
      );
      res.status(200).json(article);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await articleService.remove(
        req.params.articleId as string,
        getUserId(req),
      );
      res.status(204).send();
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async like(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const a = await articleService.like(req.params.articleId as string);
      res.status(200).json({ likeCounts: a.likeCounts });
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const a = await articleService.save(req.params.articleId as string);
      res.status(200).json({ saveCounts: a.saveCounts });
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async share(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const a = await articleService.share(req.params.articleId as string);
      res.status(200).json({ sharedCounts: a.sharedCounts });
    } catch (err) {
      handleError(err, res, next);
    }
  },
});
