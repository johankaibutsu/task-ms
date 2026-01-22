import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Setup the Postgres Driver Pool
// Uses the Transaction Pooler URL (Port 6543)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Setup the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with the Adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
