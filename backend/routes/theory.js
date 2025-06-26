// physics-olympiad-website/backend/routes/theory.js
const express = require('express');
const router = express.Router();
const {
  getTheoryTopics,
  getTheoryBySlug,
  getTheoryById, // THAY ĐỔI MỚI: Thêm hàm này vào danh sách import
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
router.route('/slug/:slug')
  .get(getTheoryBySlug);

// GET /api/theory/:id - Lấy chi tiết chủ đề theo ID (chỉ admin dùng cho trang edit)
// PUT /api/theory/:id - Cập nhật chủ đề (Admin)
// DELETE /api/theory/:id - Xóa chủ đề (Admin)
router.route('/:id')
  .get(protect, adminProtect, getTheoryById) // Hàm getTheoryById
  .put(protect, adminProtect, updateTheory)
  .delete(protect, adminProtect, deleteTheory);

module.exports = router;
