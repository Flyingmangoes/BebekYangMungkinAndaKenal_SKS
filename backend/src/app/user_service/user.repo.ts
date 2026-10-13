import { PrismaClient } from "../../generated/prisma/client"
import { User } from "../../generated/prisma/client"
import { ModifiedUser } from "../../models/model_list"

export interface UserRepositoryInterface {
    updateAccount(): Promise<User>
    removeAccount(userId: string, email: string): Promise<void>
}

export class UserRepository {
    constructor(private readonly db: PrismaClient) {}

    async updateAccount(data: ModifiedUser): Promise<User> {
        try {

        } catch(error) {

        }
    }

    async removeAccount(userId: string, email: string): Promise<void>{
        await this.db.user.deleteMany({ where: { userId }})
    }
}