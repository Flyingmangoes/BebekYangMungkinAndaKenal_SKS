import type { PH9Question, Quest, Streak, User } from "../../generated/prisma/client";
import type { AuthUser } from "../../models/model_list";

declare global {
    namespace Express {
        interface Request {
            authUser?: AuthUser;
            user?: User;
            userStreak?: Streak;
            userSideQuest?: Quest;
            phNineQuestions?: PH9Question[];
        }
    }
}