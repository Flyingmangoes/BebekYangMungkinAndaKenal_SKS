import { UserService } from "./user.services"
import { NextFunction, Request, Response } from "express"

export const UserController = (userService: UserService) => ({
    async UpdateAccountDetail(req:Request, res: Response ,next: NextFunction): Promise<void> {
        
    },

    async UpdateAccountProfile(req:Request, res:Response, next: NextFunction): Promise<void>{

    },

    async DeleteAccount(req:Request, res:Response, next:NextFunction): Promise<void> {

    }
})