// physics-olympiad-website/backend/routes/exam.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware admin

// =================================================================
// THAY ĐỔI QUAN TRỌNG:
// 1. GET /api/exams: Giờ đây dành riêng cho Admin (lấy tất cả đề thi)
// 2. GET /api/exams/public: Route mới cho người dùng công khai (chỉ lấy đề đã xuất bản)
// =================================================================

// GET /api/exams - Lấy tất cả đề thi (chỉ Admin)
// POST /api/exams - Tạo đề thi mới (Admin)
router.route('/')
  .get(protect, adminProtect, examController.getAdminExams) // THAY ĐỔI: Thêm protect, adminProtect và dùng getAdminExams
  .post(protect, adminProtect, examController.createExam);

// GET /api/exams/public - Lấy các đề thi đã xuất bản (Public)
router.get('/public', examController.getPublicExams); // THAY ĐỔI: Route mới, không bảo vệ

// GET /api/exams/slug/:slug - Lấy chi tiết đề thi theo slug (Public nếu đã publish, Admin nếu là admin)
router.route('/slug/:slug')
  .get(examController.getExamBySlug); // Giữ nguyên, logic bảo vệ bên trong controller

// GET /api/exams/:id - Lấy chi tiết đề thi theo ID (Admin)
// PUT /api/exams/:id - Cập nhật đề thi (Admin)
// DELETE /api/exams/:id - Xóa đề thi (Admin)
router.route('/:id')
  .get(protect, adminProtect, examController.getExamById)
  .put(protect, adminProtect, examController.updateExam)
  .delete(protect, adminProtect, examController.deleteExam);

module.exports = router;
