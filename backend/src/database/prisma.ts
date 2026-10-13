import { PrismaPg } from "@prisma/adapter-pg"

export const prisma

 = (dbUrl: string) => ({
    setup() {
        const adapter =  new PrismaPg({ connectionString: dbUrl });
    }
})