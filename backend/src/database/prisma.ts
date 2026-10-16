import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client";

export const Prisma = (dbUrl: string) => ({
    setup(): PrismaClient {
        const adapter =  new PrismaPg({ connectionString: dbUrl });
        return new PrismaClient({ adapter })
    }
})