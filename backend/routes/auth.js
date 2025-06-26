// physics-olympiad-website/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe, // THAY ĐỔI: Import hàm getMe
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ route

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // THAY ĐỔI: Sử dụng getMe

module.exports = router;
