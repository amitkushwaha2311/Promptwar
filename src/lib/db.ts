import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

// In serverless environments (like Netlify), the filesystem is read-only except for /tmp.
// To allow SQLite to write (e.g. for registration), we copy the db to /tmp.
if (process.env.NODE_ENV === 'production') {
  try {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      // Find the db file relative to the project root
      const srcDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(srcDbPath)) {
        fs.copyFileSync(srcDbPath, tmpDbPath);
      }
    }
    dbUrl = 'file:/tmp/dev.db';
  } catch (e) {
    console.error('Failed to copy SQLite DB to /tmp:', e);
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
