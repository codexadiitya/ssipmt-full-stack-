require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost')) return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

// ── Rate Limit ────────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── DB Status Middleware (FIX #3) ─────────────────────────────────────────────
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    // Only block non-health routes
    if (req.path !== '/health') {
      return res.status(503).json({ message: 'Database not connected. Please try again shortly.' });
    }
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notes', noteRoutes);

// Health check (also shows DB status)
app.get('/health', (_req, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  uptime: process.uptime(),
}));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Keep-Alive for Render Free Tier (FIX #2) ──────────────────────────────────
const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;
const keepAlive = () => {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      console.log('💓 Keep-alive ping sent');
    } catch (err) {
      console.error('Keep-alive failed:', err.message);
    }
  }, 14 * 60 * 1000); // Ping every 14 minutes
};

// ── Database + Start (FIX #1 & #4) ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    console.log('⏳  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1); // Force restart on Render instead of running broken
  }
};

// FIX #1: await DB connection BEFORE starting server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT}`);
    keepAlive(); // Start keep-alive after server is up
  });
};

// FIX #4: Clean shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing DB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
