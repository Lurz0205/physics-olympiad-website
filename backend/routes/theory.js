// physics-olympiad-website/backend/routes/theory.js
const express = require('express');
const router = express.Router();
const {
  getTheoryTopics,
  getTheoryBySlug,
  getTheoryById, // Lấy theo ID, dùng cho Admin Edit
  createTheory,
  updateTheory,
  deleteTheory,
} = require('../controllers/theoryController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware bảo vệ admin

// GET /api/theory - Lấy tất cả các chủ đề (Public)
// POST /api/theory - Tạo chủ đề mới (Admin)
router.route('/').get(getTheoryTopics).post(protect, adminProtect, createTheory);

// GET /api/theory/slug/:slug - Lấy chi tiết chủ đề theo slug (CHO TRANG HIỂN THỊ PUBLIC)
// THAY ĐỔI: XÓA middleware `protect` và `adminProtect` nếu muốn public
router.route('/slug/:slug')
  .get(getTheoryBySlug); // Bây giờ route này là public

// GET /api/theory/:id - Lấy chi tiết chủ đề theo ID (chỉ admin dùng cho trang edit)
// PUT /api/theory/:id - Cập nhật chủ đề (Admin)
// DELETE /api/theory/:id - Xóa chủ đề (Admin)
router.route('/:id')
  .get(protect, adminProtect, getTheoryById) // Route này vẫn BẢO VỆ bởi protect và adminProtect
  .put(protect, adminProtect, updateTheory)
  .delete(protect, adminProtect, deleteTheory);

module.exports = router;
