import type { Article } from "../../generated/prisma/client";
import { ArticleError } from "../../error/exception";
import type { ArticleRepository, ArticleWithBody, CounterField } from "./article.repo";
import type { CreateArticleInput, UpdateArticleInput } from "./article.schema";

export class ArticleService {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async create(authorId: string, input: CreateArticleInput): Promise<ArticleWithBody> {
    return this.articleRepo.createArticle(authorId, input);
  }

  async list(page: number, limit: number) {
    const { items, total } = await this.articleRepo.findMany((page - 1) * limit, limit);
    return {
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getDetail(articleId: string): Promise<ArticleWithBody> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) throw new ArticleError("NOT_FOUND");
    return article;
  }

  async update(
    articleId: string,
    userId: string,
    input: UpdateArticleInput,
  ): Promise<ArticleWithBody> {
    await this.assertOwner(articleId, userId);
    return this.articleRepo.updateArticle(articleId, input);
  }

  async remove(articleId: string, userId: string): Promise<void> {
    await this.assertOwner(articleId, userId);
    await this.articleRepo.deleteArticle(articleId);
  }

  like(articleId: string): Promise<Article> {
    return this.increment(articleId, "likeCounts");
  }

  save(articleId: string): Promise<Article> {
    return this.increment(articleId, "saveCounts");
  }

  share(articleId: string): Promise<Article> {
    return this.increment(articleId, "sharedCounts");
  }

  private increment(articleId: string, field: CounterField): Promise<Article> {
    return this.articleRepo.incrementCounter(articleId, field);
  }

  private async assertOwner(articleId: string, userId: string): Promise<void> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) throw new ArticleError("NOT_FOUND");
    if (article.authorId !== userId) throw new ArticleError("FORBIDDEN");
  }
}