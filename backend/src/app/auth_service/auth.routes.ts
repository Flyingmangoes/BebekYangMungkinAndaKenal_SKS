import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";
import { RLFactory } from "../../middlewares/rate_limiter";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { AuthController } from "./auth.controllers"
import type { AuthService } from "./auth.services";

export function authRouteFactory(limit: number, windowM: number, service: AuthService): Router {
    const router = Router();
    const ctrl = AuthController(service);
    const rateLimiter = RLFactory(windowM, limit).authRateLimit()

    router.post("/register",   rateLimiter, validate(registerSchema), ctrl.register);
    router.post("/login",      rateLimiter, validate(loginSchema),    ctrl.login);
    router.post("/refresh",    rateLimiter, validate(refreshSchema),  ctrl.refresh);
    router.post("/logout",     validate(refreshSchema),               ctrl.logout);
    router.post("/logout-all", requireAuth,                           ctrl.logoutAll);

    return router;
}