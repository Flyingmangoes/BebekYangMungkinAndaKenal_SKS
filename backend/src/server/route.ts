import { authRouteFactory } from "../app/auth_service/auth.routes";
import { userRouteFactory } from "../app/user_service/user.routes";
import { checkinRouteFactory } from "../app/checkin_streak/checkin/checkin_streak.routes";
import { Router } from "express";
import { UserService } from "../app/user_service/user.services";
import { AuthService } from "../app/auth_service/auth.services";
import { CheckinService } from "../app/checkin_streak/checkin/checkin.services";
import { RLFactory } from "../middlewares/rate_limiter";

export interface routeRequired {
    userService: UserService;
    authService: AuthService;
    checkinService: CheckinService;
    mainLimit: number
    authLimit: number
    windowMinute: number
}

export function routeFactory(required: routeRequired) {
    const router = Router();
    const userRoute = userRouteFactory(required.userService);
    const authRoute = authRouteFactory(required.authService);
    const checkinRoute = checkinRouteFactory(required.checkinService);
    const authRateLimit = RLFactory(required.windowMinute, required.authLimit);
    const mainRateLimit = RLFactory(required.windowMinute, required.mainLimit);
}