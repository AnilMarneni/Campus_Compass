import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Set up WebSocket constructor for Node.js server environment
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  neonPool: Pool | undefined;
};

const connectionString = (process.env.DATABASE_URL || '').replace(/^['"]|['"]$/g, '');
console.log("[PRISMA INIT] DATABASE_URL is", connectionString ? "defined (length: " + connectionString.length + ", starts with: " + connectionString.substring(0, 10) + ")" : "undefined/empty");

const pool = globalForPrisma.neonPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== 'production') globalForPrisma.neonPool = pool;

const adapter = new PrismaNeon({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

