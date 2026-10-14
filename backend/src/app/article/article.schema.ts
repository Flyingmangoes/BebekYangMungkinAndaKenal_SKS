import { z } from "zod";

const articleIdParam = z.object({ articleId: z.string().uuid() });

export const createArticleSchema = z.object({
  body: z.object({
    articleTitle: z.string().trim().min(1).max(200),
    articleDescription: z.string().trim().min(1).max(500),
    thumbnailUrl: z.string().url(),
    imageUrls: z.array(z.string().url()).max(20).default([]),
    content: z.string().min(1),
  }),
});

export const listArticleSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export const articleParamSchema = z.object({
  params: articleIdParam,
});

export const updateArticleSchema = z.object({
  params: articleIdParam,
  body: z
    .object({
      articleTitle: z.string().trim().min(1).max(200).optional(),
      articleDescription: z.string().trim().min(1).max(500).optional(),
      thumbnailUrl: z.string().url().optional(),
      imageUrls: z.array(z.string().url()).max(20).optional(),
      content: z.string().min(1).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
      message: "At least one field must be provided",
    }),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>["body"];
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>["body"];