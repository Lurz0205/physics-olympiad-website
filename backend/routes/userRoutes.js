// physics-olympiad-website/backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware bảo vệ admin

// Tất cả các route này yêu cầu người dùng phải đăng nhập VÀ phải là Admin
router.route('/')
  .get(protect, adminProtect, getUsers); // Lấy tất cả người dùng

router.route('/:id')
  .get(protect, adminProtect, getUserById) // Lấy thông tin người dùng theo ID
  .put(protect, adminProtect, updateUser)    // Cập nhật người dùng
  .delete(protect, adminProtect, deleteUser); // Xóa người dùng

module.exports = router;
