import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { Server as HttpServer } from "node:http";
import { AuthRepository } from "./app/auth_service/auth.repo";
import { AuthService } from "./app/auth_service/auth.services";
import { TokenRepository } from "./app/auth_service/token.repo";
import { CheckinRepository } from "./app/checkin_streak/checkin/checkin.repo";
import { CheckinService } from "./app/checkin_streak/checkin/checkin.services";
import { StreakRepository } from "./app/checkin_streak/streak/streak.repo";
import { UserRepository } from "./app/user_service/user.repo";
import { UserService } from "./app/user_service/user.services";
import { config } from "./config/config";
import { Prisma } from "./database/prisma";
import { routeFactory } from "./server/route";
import { MissionService } from "./app/mission_service/mission.services";
import { MissionRepository } from "./app/mission_service/mission.repo";
import { Ph9Service } from "./app/ph9_service/ph9.services";
import { Ph9Repository } from "./app/ph9_service/ph9.repo";
import { ArticleService } from "./app/article_service/article.services";
import { ArticleRepository } from "./app/article_service/article.repo";
import { QuestSuggestionService } from "./app/ai_service/suggestion/suggestion.services";
import { MemoryQuestSetCache } from "./app/ai_service/suggestion/suggestion.cache";
import { AIService } from "./app/ai_service/ai.services";
import { GeminiQuestGenerator } from "./app/ai_service/ai.provider";
import type { GeminiOptions } from "./app/ai_service/ai.provider";
import { GeminiInsightGenerator } from "./app/ai_service/ai.insight.provider";
import { InsightAIService } from "./app/ai_service/ai.insight.services";
import { InsightService } from "./app/ai_service/insight/insight.services";
import { MemoryInsightCache } from "./app/ai_service/insight/insight.cache";

export function createApp(): Express {
	const db = Prisma(config.Database.databaseUrl).setup();

	const authService = new AuthService(
		new AuthRepository(db),
		new TokenRepository(db),
	);
	const userService = new UserService(new UserRepository(db));
	const checkinService = new CheckinService(
		new CheckinRepository(db),
		new StreakRepository(db),
	);

	const articleService = new ArticleService(new ArticleRepository(db));
	const ph9Service = new Ph9Service(new Ph9Repository(db));

	const geminiOptions: GeminiOptions = {
		apiKey: config.AI.geminiApiKey,
		model: config.AI.model,
		timeoutMs: config.AI.timeoutMs,
	};
	const aiLogger = { warn: (message: string, meta?: Record<string, unknown>) => console.warn(message, meta) };

	const questCache = new MemoryQuestSetCache(24 * 60 * 60 * 1000, 5000); // 24 h, max 5000 users
	const aiService = new AIService(new GeminiQuestGenerator(geminiOptions), aiLogger);
	const suggestionService = new QuestSuggestionService(ph9Service, aiService, questCache);

	const insightCache = new MemoryInsightCache(24 * 60 * 60 * 1000, 5000); // 24 h, max 5000 users
	const insightAIService = new InsightAIService(new GeminiInsightGenerator(geminiOptions), aiLogger);
	const insightService = new InsightService(ph9Service, insightAIService, insightCache);

	const missionService = new MissionService(new MissionRepository(db), questCache);

	const app = express();
	app.use(helmet());
	app.use(cors({ origin: config.Server.frontendUrl }));
	app.use(express.json());
	app.use(
		"/api",
		routeFactory({
			authService,
			userService,
			checkinService,
			missionService,
			articleService,
			suggestionService,
			insightService,
			ph9Service,
			mainLimit: config.Server.mainLimit,
			authLimit: config.Server.authLimit,
			windowMinute: config.Server.windowMinute,
		}),
	);

	return app;
}

export function startApp(): HttpServer {
	const app = createApp();
	const server = app.listen(config.Server.port, config.Server.host, () => {
		console.info(`Server listening on http://${config.Server.host}:${config.Server.port}`);
	});

	return server;
}