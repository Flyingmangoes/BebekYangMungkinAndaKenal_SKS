import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const portSchema = z.coerce.number().int().min(1).max(65535);
const positiveInt = z.coerce.number().int().min(1);

const EnvSchema = z
    .object({
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

        PORT: portSchema.default(3000),
        HOST: z.string().default("localhost"),

        HTTP_PROTOCOL: z.enum(["http:", "https:"]).default("http:"),
        FRONTEND_URL: z.url().default("http://localhost:5173"),

        MAIN_LIMIT: positiveInt.default(100),
        AUTH_LIMIT: positiveInt.default(10),
        WINDOW_MINUTE: positiveInt.default(15),

        DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
        DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
        JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

        ML_URL: z.url().default("http://localhost:8000"),
        ML_TIMEOUT_MS: positiveInt.default(3000),
        ML_SHARED_SECRET: z.string().min(1).optional(),
    })
    .superRefine((env, ctx) => {
        if (env.NODE_ENV === "production" && !env.ML_SHARED_SECRET) {
            ctx.addIssue({
                code: "custom",
                path: ["ML_SHARED_SECRET"],
                message: "ML_SHARED_SECRET is required in production",
            });
        }
    });

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    // field names and messages only, never the values
    console.error("Invalid environment configuration:", z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}

const env = parsed.data;

export const config = {
    Server: {
        port: env.PORT,
        host: env.HOST,

        frontendUrl: env.FRONTEND_URL,
        proxyURL: new URL(`${env.HTTP_PROTOCOL}//${env.HOST}:${env.PORT}`),

        isProd: env.NODE_ENV === "production",
        isDev: env.NODE_ENV === "development",
        isTest: env.NODE_ENV === "test",

        windowMinute: env.WINDOW_MINUTE,
        authLimit: env.AUTH_LIMIT,
        mainLimit: env.MAIN_LIMIT,
    },
    Database: {
        directUrl: env.DIRECT_URL,
        databaseUrl : env.DATABASE_URL
    },
    Auth: {
        jwtSecret: env.JWT_SECRET,
    },
    ML: {
        url: env.ML_URL,
        timeoutMs: env.ML_TIMEOUT_MS,
        sharedSecret: env.ML_SHARED_SECRET,
    },
} as const;