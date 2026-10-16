-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "consent_src" TEXT NOT NULL,
    "email_consent" BOOLEAN NOT NULL,
    "phone_number_consent" BOOLEAN NOT NULL,
    "consent_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "user_id" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_check_in_date" DATE,
    "first_check_in_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "check_in_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "article_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "article_title" TEXT NOT NULL,
    "article_description" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "like_counts" INTEGER NOT NULL DEFAULT 0,
    "save_counts" INTEGER NOT NULL DEFAULT 0,
    "shared_counts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "article_bodies" (
    "article_id" UUID NOT NULL,
    "image_urls" TEXT[],
    "content" TEXT NOT NULL,

    CONSTRAINT "article_bodies_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "quests" (
    "quest_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quest_title" TEXT NOT NULL,
    "quest_description" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "quest_version" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("quest_id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "token_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "ph9_questions" (
    "question_id" UUID NOT NULL,
    "question_index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ph9_questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "ph9_question_translations" (
    "question_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "question_body" TEXT NOT NULL,

    CONSTRAINT "ph9_question_translations_pkey" PRIMARY KEY ("question_id","language")
);

-- CreateTable
CREATE TABLE "ph9_submissions" (
    "submission_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "total_score" INTEGER NOT NULL,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ph9_submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "ph9_answers" (
    "answer_id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answer_value" INTEGER NOT NULL,

    CONSTRAINT "ph9_answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "game_model" (
    "game_id" UUID NOT NULL,

    CONSTRAINT "game_model_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "game_session" (
    "session_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,

    CONSTRAINT "game_session_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_user_id_check_in_date_key" ON "check_ins"("user_id", "check_in_date");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE INDEX "quests_user_id_idx" ON "quests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ph9_questions_question_index_key" ON "ph9_questions"("question_index");

-- CreateIndex
CREATE INDEX "ph9_submissions_user_id_submitted_at_idx" ON "ph9_submissions"("user_id", "submitted_at");

-- CreateIndex
CREATE INDEX "ph9_answers_question_id_idx" ON "ph9_answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "ph9_answers_submission_id_question_id_key" ON "ph9_answers"("submission_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_session_game_id_key" ON "game_session"("game_id");

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_bodies" ADD CONSTRAINT "article_bodies_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("article_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ph9_question_translations" ADD CONSTRAINT "ph9_question_translations_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "ph9_questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ph9_submissions" ADD CONSTRAINT "ph9_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ph9_answers" ADD CONSTRAINT "ph9_answers_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "ph9_submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ph9_answers" ADD CONSTRAINT "ph9_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "ph9_questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game_model"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;
