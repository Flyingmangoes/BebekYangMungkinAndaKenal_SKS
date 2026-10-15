import { UserService } from "./user.services"
import { NextFunction, Request, Response } from "express"
import { handleAuthError } from "../../error/error_handling"
import type { AccountDetailUpdate, ProfileUpdate } from "../../models/model_list"

const getUserId = (req: Request): string | undefined => req.authUser?.userId

export const UserController = (userService: UserService) => ({
    async UpdateAccountDetail(req:Request, res: Response ,next: NextFunction): Promise<void> {
        const userId = getUserId(req)
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" })
            return
        }

        try {
            const user = await userService.updateAccountDetail(userId, req.body as AccountDetailUpdate)
            res.status(200).json(user)
        } catch (err) {
            handleAuthError(err, res, next)
        }
    },

    async UpdateAccountProfile(req:Request, res:Response, next: NextFunction): Promise<void>{
        const userId = getUserId(req)
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" })
            return
        }

        try {
            const user = await userService.updateProfile(userId, req.body as ProfileUpdate)
            res.status(200).json(user)
        } catch (err) {
            handleAuthError(err, res, next)
        }
    },

    async DeleteAccount(req:Request, res:Response, next:NextFunction): Promise<void> {
        const userId = getUserId(req)
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" })
            return
        }

        try {
            const { currentPassword } = req.body as { currentPassword: string }
            await userService.removeAccount(userId, currentPassword)
            res.status(204).end()
        } catch (err) {
            handleAuthError(err, res, next)
        }
    }
})