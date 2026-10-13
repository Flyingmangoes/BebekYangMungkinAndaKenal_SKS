import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "./auth.services";
import { AuthError } from "../../error/exception";

export const AuthController = (authService: AuthService) => ({
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await authService.register(req.body);   
            res.status(201).json(user);                          
        } catch (err) {
        if (err instanceof AuthError) {
            res.status(409).json({ message: "Username or email already in use" });
            return;
        }
        next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokens = await authService.login(req.body);
            res.json(tokens);
        } catch (err) {
        if (err instanceof AuthError) {
            res.status(401).json({ message: "Invalid credentials" });   // one generic message
            return;
        }
        next(err);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokens = await authService.refresh(req.body.refreshToken);
            res.json(tokens);
        } catch (err) {
        if (err instanceof AuthError) {
            res.status(401).json({ message: "Session expired, please log in again" });
            return;
        }
        next(err);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await authService.logout(req.body.refreshToken);
            res.status(204).end();                              
        } catch (err) {
            next(err);
        }
    },

    async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await authService.logoutAll(req.body)
            res.status(204).end()
        } catch (err) {
            next(err)         
        }
    }
});