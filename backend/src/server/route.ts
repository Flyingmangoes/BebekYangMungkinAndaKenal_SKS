import { authRouteFactory } from "../app/auth_service/auth.routes";
import { userRouteFactory } from "../app/user_service/user.routes";
import { checkinRouteFactory } from "../app/checkin_streak/checkin/checkin.streak.routes";
import { articleRouteFactory } from "../app/article_service/article.routes";
import { missionRouteFactory } from "../app/mission_service/mission.routes";
import { createPh9Router } from "../app/ph9_service/ph9.routes";
import { Ph9Controller } from "../app/ph9_service/ph9.controllers";
import { Router, type RequestHandler } from "express";
import type { UserService } from "../app/user_service/user.services";
import type { AuthService } from "../app/auth_service/auth.services";
import type { CheckinService } from "../app/checkin_streak/checkin/checkin.services";
import { RLFactory } from "../middlewares/rate_limiter";
import { MissionService } from "../app/mission_service/mission.services";
import { ArticleService } from "../app/article_service/article.services";
import { Ph9Service } from "../app/ph9_service/ph9.services";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { SuggestionController } from "../app/ai_service/cache/suggestion.controllers";
import { createSuggestionRouter } from "../app/ai_service/cache/suggestion.routes";
import type { QuestSuggestionService } from "../app/ai_service/cache/suggestion.services";


export interface RouteRequired {
    userService: UserService;
    authService: AuthService;
    checkinService: CheckinService;
    missionService: MissionService;
    articleService: ArticleService;
    suggestionService: QuestSuggestionService;
    ph9Service: Ph9Service;
    mainLimit: number;
    authLimit: number;
    windowMinute: number;
}

export function routeFactory(required: RouteRequired): Router {
    const v1 = Router();
    const userRoute = userRouteFactory(required.userService);
    const authRoute = authRouteFactory(required.authService);
    const checkinRoute = checkinRouteFactory(required.checkinService);
    const missionRoute = missionRouteFactory(required.missionService);
    const articleRoute = articleRouteFactory(required.articleService);
    const authRateLimit = RLFactory(required.windowMinute, required.authLimit);
    const mainRateLimit = RLFactory(required.windowMinute, required.mainLimit);

    v1.use("/auth", authRateLimit.authRateLimit() as RequestHandler, authRoute);
    v1.use("/user", mainRateLimit.mainRateLimit() as RequestHandler, userRoute);
    v1.use("/checkin", mainRateLimit.mainRateLimit() as RequestHandler, checkinRoute);
    v1.use("/missions", mainRateLimit.mainRateLimit() as RequestHandler, missionRoute);
    v1.use("/articles", mainRateLimit.mainRateLimit() as RequestHandler, articleRoute);
    v1.use(
        "/ph9",
        mainRateLimit.mainRateLimit() as RequestHandler,
        createPh9Router({
            controller: Ph9Controller(required.ph9Service),
            requireAuth,
            submitLimiter: authRateLimit.authRateLimit() as RequestHandler,
            validate,
        }),
    );
    v1.use(
        "/ai",
        mainRateLimit.mainRateLimit() as RequestHandler,
        createSuggestionRouter({
            controller: SuggestionController(required.suggestionService),
            requireAuth,
            refreshLimiter: authRateLimit.authRateLimit() as RequestHandler,
        }),
    );

    const router = Router();
    router.use("/v1", v1);
    return router;
}