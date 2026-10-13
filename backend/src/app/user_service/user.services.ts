import { UserRepository } from "./user.repo";

export interface UserServiceOptions {

}

export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        opts: UserServiceOptions
    ){}

    async updateProfile() {

    }

    async updateAccount() {

    }

    async removeAccount() {

    }
}