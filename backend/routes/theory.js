// physics-olympiad-website/backend/routes/theory.js
const express = require('express');
const router = express.Router();
const {
  getTheoryTopics,
  getTheoryBySlug,
  createTheory,
  updateTheory,
  deleteTheory,
} = require('../controllers/theoryController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // THAY ĐỔI MỚI: Import middleware adminProtect

// GET /api/theory - Lấy tất cả các chủ đề (Public - ai cũng xem được)
// POST /api/theory - Tạo chủ đề mới (Chỉ Admin)
router.route('/').get(getTheoryTopics).post(protect, adminProtect, createTheory); // Áp dụng protect và adminProtect

// GET /api/theory/:slug - Lấy chi tiết chủ đề theo slug (Public - ai cũng xem được)
router.route('/:slug')
  .get(getTheoryBySlug);

// PUT /api/theory/:id - Cập nhật chủ đề (Chỉ Admin)
// DELETE /api/theory/:id - Xóa chủ đề (Chỉ Admin)
router.route('/:id')
  .put(protect, adminProtect, updateTheory)    // Áp dụng protect và adminProtect
  .delete(protect, adminProtect, deleteTheory); // Áp dụng protect và adminProtect

module.exports = router;
