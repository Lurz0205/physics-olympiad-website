// physics-olympiad-website/backend/routes/theory.js
const express = require('express');
const router = express.Router();
const {
  getTheoryTopics,
  getTheoryBySlug, // Lấy theo slug (cho trang hiển thị user)
  createTheory,
  updateTheory,
  deleteTheory,
} = require('../controllers/theoryController');
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminAuthMiddleware');

// GET /api/theory - Lấy tất cả các chủ đề (Public)
// POST /api/theory - Tạo chủ đề mới (Admin)
router.route('/').get(getTheoryTopics).post(protect, adminProtect, createTheory);

// GET /api/theory/slug/:slug - Lấy chi tiết chủ đề theo slug (cho trang hiển thị user)
// Đổi route này để tránh nhầm lẫn với ID
router.route('/slug/:slug') // THAY ĐỔI MỚI: Đổi tên route để lấy theo slug
  .get(getTheoryBySlug);

// GET /api/theory/:id - Lấy chi tiết chủ đề theo ID (chỉ admin dùng cho trang edit)
// PUT /api/theory/:id - Cập nhật chủ đề (Admin)
// DELETE /api/theory/:id - Xóa chủ đề (Admin)
router.route('/:id') // THAY ĐỔI MỚI: Thêm GET cho route này
  .get(protect, adminProtect, getTheoryById) // THAY ĐỔI MỚI: Hàm getTheoryById
  .put(protect, adminProtect, updateTheory)
  .delete(protect, adminProtect, deleteTheory);

module.exports = router;
