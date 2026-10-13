import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client";

export const prisma = (dbUrl: string) => ({
    setup(): PrismaClient {
        const adapter =  new PrismaPg({ connectionString: dbUrl });
        return new PrismaClient({ adapter })
    }
})