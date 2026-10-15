import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";
import { RLFactory } from "../../middlewares/rate_limiter";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { AuthController } from "./auth.controllers"
import type { AuthService } from "./auth.services";

export function authRouteFactory(service: AuthService): Router {
    const router = Router();
    const ctrl = AuthController(service);

    router.post("/register",   validate(registerSchema), ctrl.register);
    router.post("/login",      validate(loginSchema),    ctrl.login);
    router.post("/refresh",    validate(refreshSchema),  ctrl.refresh);
    router.post("/logout",     validate(refreshSchema),               ctrl.logout);
    router.post("/logout-all", requireAuth,                           ctrl.logoutAll);

    return router;
}