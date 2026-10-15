import { Prisma } from "../../generated/prisma/client";
import type { PrismaClient, Article, ArticleBody } from "../../generated/prisma/client";
import { ArticleError } from "../../error/exception";
import type { CreateArticleInput, UpdateArticleInput } from "./article.schema";

export type ArticleWithBody = Article & { articleBody: ArticleBody | null };
export type CounterField = "likeCounts" | "saveCounts" | "sharedCounts";

const isNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export class ArticleRepository {
  constructor(private readonly db: PrismaClient) {}

  async createArticle(authorId: string, input: CreateArticleInput): Promise<ArticleWithBody> {
    // Article + ArticleBody dibuat dalam satu transaksi
    return this.db.$transaction(async (tx) => {
      return tx.article.create({
        data: {
          authorId,
          articleTitle: input.articleTitle,
          articleDescription: input.articleDescription,
          thumbnailUrl: input.thumbnailUrl,
          articleBody: {
            create: { imageUrls: input.imageUrls, content: input.content },
          },
        },
        include: { articleBody: true },
      });
    });
  }

  async findMany(skip: number, take: number): Promise<{ items: Article[]; total: number }> {
    const [items, total] = await this.db.$transaction([
      this.db.article.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
      this.db.article.count(),
    ]);
    return { items, total };
  }

  async findById(articleId: string): Promise<ArticleWithBody | null> {
    return this.db.article.findUnique({
      where: { articleId },
      include: { articleBody: true },
    });
  }

  async updateArticle(articleId: string, input: UpdateArticleInput): Promise<ArticleWithBody> {
    const { articleTitle, articleDescription, thumbnailUrl, imageUrls, content } = input;
    const hasBody = imageUrls !== undefined || content !== undefined;

    try {
      return await this.db.article.update({
        where: { articleId },
        data: {
          ...(articleTitle !== undefined && { articleTitle }),
          ...(articleDescription !== undefined && { articleDescription }),
          ...(thumbnailUrl !== undefined && { thumbnailUrl }),
          ...(hasBody && {
            articleBody: {
              update: {
                ...(imageUrls !== undefined && { imageUrls }),
                ...(content !== undefined && { content }),
              },
            },
          }),
        },
        include: { articleBody: true },
      });
    } catch (error) {
      if (isNotFound(error)) throw new ArticleError("NOT_FOUND");
      throw error;
    }
  }

  async deleteArticle(articleId: string): Promise<void> {
    try {
      // ArticleBody ikut terhapus lewat onDelete: Cascade
      await this.db.article.delete({ where: { articleId } });
    } catch (error) {
      if (isNotFound(error)) throw new ArticleError("NOT_FOUND");
      throw error;
    }
  }

  async incrementCounter(articleId: string, field: CounterField): Promise<Article> {
    try {
      return await this.db.article.update({
        where: { articleId },
        data: { [field]: { increment: 1 } },
      });
    } catch (error) {
      if (isNotFound(error)) throw new ArticleError("NOT_FOUND");
      throw error;
    }
  }
}