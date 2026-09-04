import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Singleton: prevent multiple instances in dev (nodemon hot-reload safe)
if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });
}

export const prisma = global.__prisma;

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('MongoDB Atlas connected via Prisma');
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
};
