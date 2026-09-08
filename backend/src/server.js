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
app.disable('x-powered-by');
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  'https://new-local-kart-website.vercel.app',
  'https://local-kart-shop-agent-4vgq-six.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5001',
  'http://127.0.0.1:5173'
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, curl, or Next.js internal rewrites
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow configured origins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow any Vercel production or preview deployment
    if (cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow localhost in non-production
    if (!isProduction && (cleanOrigin.startsWith('http://localhost:') || cleanOrigin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }

    console.warn(`[CORS Warning] Blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// ── Socket.io setup ──────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
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
app.use(cors(corsOptions));
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
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root health check
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'LocalKart API v2.0 — MongoDB Atlas + Prisma + Socket.io',
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
    logger.info(`🌍 Accepting CORS from: ${allowedOrigins.join(', ')}`);
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
