import type { AuthUser } from "../../models/user"
import type { PH9Question } from "../../models/ph9"
import { User } from "@supabase/supabase-js";
import { Streak } from "../../models/streak";
import { Quest } from "../../models/quest";

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