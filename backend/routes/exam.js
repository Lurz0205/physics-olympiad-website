// physics-olympiad-website/backend/routes/exam.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminAuthMiddleware');

// GET /api/exams - Lấy tất cả đề thi (Public cho đã publish, Admin cho tất cả)
// POST /api/exams - Tạo đề thi mới (Admin)
router.route('/')
  .get(examController.getExams)
  .post(protect, adminProtect, examController.createExam);

// GET /api/exams/slug/:slug - Lấy chi tiết đề thi theo slug (Public nếu đã publish)
router.route('/slug/:slug')
  .get(examController.getExamBySlug);

// GET /api/exams/:id - Lấy chi tiết đề thi theo ID (Admin)
// PUT /api/exams/:id - Cập nhật đề thi (Admin)
// DELETE /api/exams/:id - Xóa đề thi (Admin)
router.route('/:id')
  .get(protect, adminProtect, examController.getExamById)
  .put(protect, adminProtect, examController.updateExam)
  .delete(protect, adminProtect, examController.deleteExam);

module.exports = router;
