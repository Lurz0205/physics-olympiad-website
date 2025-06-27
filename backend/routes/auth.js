// physics-olympiad-website/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController'); // THAY ĐỔI: Đảm bảo import đúng các hàm
const protect = require('../middleware/authMiddleware');

// Route Đăng ký người dùng
router.post('/register', registerUser);

// Route Đăng nhập người dùng
router.post('/login', loginUser); // LỖI ĐÃ XẢY RA Ở ĐÂY HOẶC TRONG register

// Route Lấy thông tin người dùng hiện tại (yêu cầu đăng nhập)
router.get('/me', protect, getMe);

module.exports = router;
