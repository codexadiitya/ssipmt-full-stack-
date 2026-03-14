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

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps, Render health checks)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain dynamically
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Rate-limit auth endpoints (15 req / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Database + Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with timeout options
const connectDB = async () => {
  try {
    console.log('⏳  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000, // 10 seconds timeout
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    // On production, we might want to keep the server running but restricted
    // For now, let's log it clearly
  }
};

connectDB();

app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
