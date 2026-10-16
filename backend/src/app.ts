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
import { QuestSuggestionService } from "./app/ai_service/cache/suggestion.services";
import { MemoryQuestSetCache } from "./app/ai_service/cache/suggestion.cache";
import { AIService } from "./app/ai_service/ai.services";
import { GeminiQuestGenerator } from "./app/ai_service/ai.provider";

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

    const missionService = new MissionService(
        new MissionRepository(db)
    )

    const articleService = new ArticleService(
        new ArticleRepository(db)
    )

    const ph9Service = new Ph9Service(
        new Ph9Repository(db)
    )

	const generator = new GeminiQuestGenerator({
		apiKey: config.AI.geminiApiKey,
		model: config.AI.model,
		timeoutMs: config.AI.timeoutMs
	})
	
	const aiService = new AIService(generator, { warn: (message, meta) => console.warn(message, meta) })

	const questCache = new MemoryQuestSetCache(24 * 60 * 60 * 1000, 5000); // 24 h, max 5000 users
	const suggestionService = new QuestSuggestionService(ph9Service, aiService, questCache);

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
	