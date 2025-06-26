// physics-olympiad-website/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ token (cho người dùng bình thường)

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Route này được bảo vệ bởi `protect` để lấy thông tin user đã đăng nhập

module.exports = router;
