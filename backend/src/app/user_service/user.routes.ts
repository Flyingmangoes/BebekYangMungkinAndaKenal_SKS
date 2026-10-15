import { Router } from "express";
import { UserService } from "./user.services";
import { UserController } from "./user.controllers";
import { RLFactory } from "../../middlewares/rate_limiter";
import { requireAuth, requirePermission, requireRole } from "../../middlewares/auth";

export function userRouteFactory(service: UserService): Router {
    const router = Router();
    const controller = UserController(service);

    router.put(
        "/update-profile",
        requireAuth,
        requireRole("user"),
        requirePermission("profile", "update"),
        controller.UpdateAccountProfile,
    )
    router.put(
        "/update-account",
        requireAuth,
        requireRole("user"),
        requirePermission("profile", "update"),
        controller.UpdateAccountDetail,
    )
    router.delete(
        "",
        requireAuth,
        requireRole("user"),
        requirePermission("profile", "delete"),
        controller.DeleteAccount,
    )

    return router

}