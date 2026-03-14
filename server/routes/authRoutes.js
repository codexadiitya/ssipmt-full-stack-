const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getMe, getProfile, updatePassword, seedUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerSchema, loginSchema, refreshSchema } = require('../middleware/validateMiddleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refreshToken);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);
router.put('/update-password', protect, updatePassword);
// One-time seed route — protected by secret key, remove after first use
router.post('/seed', seedUsers);

module.exports = router;
