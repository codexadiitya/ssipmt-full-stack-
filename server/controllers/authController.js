const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Token helpers ─────────────────────────────────────────────────────────────
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

// ── @POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role, enrollmentNo, branch, semester, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role, enrollmentNo, branch, semester, phone });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ── @POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ── @POST /api/auth/refresh ───────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = signAccessToken(user._id);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

// ── @GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// ── @GET /api/auth/profile ────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profile: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @PUT /api/auth/update-password ────────────────────────────────────────────
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Explicitly select password to verify
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('updatePassword error:', err);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

// ── @POST /api/auth/seed ──────────────────────────────────────────────────────
const seedUsers = async (req, res) => {
  try {
    const { secret } = req.body;
    if (secret !== 'ssipmt_seed_2024') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const defaultUsers = [
      { name: 'Admin User', email: 'admin@ssipmt.com', password: 'password123', role: 'admin', branch: 'Admin', isActive: true },
      { name: 'Faculty Demo', email: 'faculty@ssipmt.com', password: 'password123', role: 'faculty', branch: 'CSE', isActive: true },
      { name: 'Student Demo', email: 'student@ssipmt.com', password: 'password123', role: 'student', branch: 'CSE', semester: 4, enrollmentNo: 'CS2101001', isActive: true },
    ];

    const results = [];
    for (const userData of defaultUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        results.push({ email: userData.email, status: 'already exists' });
      } else {
        await User.create(userData);
        results.push({ email: userData.email, status: 'created' });
      }
    }

    res.json({ message: 'Seed complete', results });
  } catch (err) {
    console.error('seed error:', err);
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
};

module.exports = { register, login, refreshToken, getMe, getProfile, updatePassword, seedUsers };
