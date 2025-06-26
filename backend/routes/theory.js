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
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ route nếu cần

// Các route cơ bản cho lý thuyết
// GET /api/theory - Lấy tất cả các chủ đề
// POST /api/theory - Tạo chủ đề mới (có thể cần protect)
router.route('/').get(getTheoryTopics).post(protect, createTheory);

// GET /api/theory/:slug - Lấy chi tiết chủ đề theo slug
// PUT /api/theory/:id - Cập nhật chủ đề (có thể cần protect)
// DELETE /api/theory/:id - Xóa chủ đề (có thể cần protect)
router.route('/:slug') // Đã thay đổi từ :id sang :slug cho GET
  .get(getTheoryBySlug);

router.route('/:id') // Dùng :id cho PUT/DELETE nếu bạn muốn cập nhật/xóa bằng ID
  .put(protect, updateTheory)
  .delete(protect, deleteTheory);

module.exports = router;
