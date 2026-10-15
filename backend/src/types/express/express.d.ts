import type { Ph9QuestionTranslation ,Ph9Question, Ph9Answer, Ph9Submission, Quest, Streak } from "../../generated/prisma/client";
import type { AuthUser } from "../../models/model_list";

declare global {
    namespace Express {
        interface Request {
            authUser?: AuthUser;
            userStreak?: Streak;
            userSideQuest?: Quest;
            ph9Questions?: Ph9Question[];
            ph9Answer?:Ph9Answer[];
            ph9Submission?:Ph9Submission;
            ph9QuestionTranslation?:Ph9QuestionTranslation;
        }
    }
}