// physics-olympiad-website/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController'); // Import từ controller mới tạo
const protect = require('../middleware/authMiddleware'); // Đảm bảo đường dẫn đúng

router.post('/register', register); // Route đăng ký
router.post('/login', login);     // Route đăng nhập
router.get('/me', protect, getMe); // Route bảo vệ để lấy thông tin người dùng hiện tại

module.exports = router;
