import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { setIO } from './config/socket.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import shopRoutes from './routes/shop.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ── Socket.io setup ──────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Clients can join role-based rooms
  socket.on('join:room', (room) => {
    socket.join(room);
    logger.debug(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    logger.debug(`Socket disconnected: ${socket.id}`);
  });
});

// Save to singleton
setIO(io);

// ── Express Middlewares ──────────────────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root health check
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'LocalKart API v2.0 — PostgreSQL + Prisma + Socket.io',
    roles: ['SHOPKEEPER', 'DELIVERY_PARTNER'],
    endpoints: {
      auth: '/api/auth',
      shop: '/api/shop',
      products: '/api/products',
      orders: '/api/orders',
      delivery: '/api/delivery',
      dashboard: '/api/dashboard',
    },
  });
});

// 404 + Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// ── Startup ──────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    logger.info(`🚀 LocalKart API running on http://localhost:${PORT}`);
    logger.info(`🔌 Socket.io ready`);
    logger.info(`🌍 Accepting CORS from: ${CORS_ORIGIN}`);
    logger.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start();

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  httpServer.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => process.exit(0));
});
