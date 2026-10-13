import dotenv from "dotenv";
import {z} from "zod";

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    PORT: z.coerce.number().default(3000),
    HOST: z.string().default("localhost"),

    FRONTEND_URL: z.url().default("http://localhost:5173"),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DATABASE_SERVICE_ROLE_KEY: z.string().min(1, "DATABASE_SERVICE_ROLE_KEY is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    ML_URL: z.url().default("http://localhost:8000"),
    ML_TIMEOUT_MS: z.coerce.number().default(3000),
    ML_SHARED_SECRET: z.string().optional(),
})

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment configuration: ", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

const env = parsed.data;
export const config = {
    Server: {
        port: env.PORT,
        host: env.HOST,
        frontendUrl: env.FRONTEND_URL,
        isProd: env.NODE_ENV === "production",
    },
    Database: {
        url: env.DATABASE_URL,
        serviceRoleKey: env.DATABASE_SERVICE_ROLE_KEY,
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