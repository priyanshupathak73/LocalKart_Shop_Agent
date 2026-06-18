const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

// Singleton: prevent multiple instances in dev (nodemon hot-reload safe)
if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });
}

const prisma = global.__prisma;

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected via Prisma');
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
