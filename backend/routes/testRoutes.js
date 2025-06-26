// physics-olympiad-website/backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestBySlug,
  getTestAnswers,
  createTest,
  updateTest,
  deleteTest,
  createTestQuestion,
  updateTestQuestion,
  deleteTestQuestion,
} = require('../controllers/testController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware bảo vệ admin

// Routes cho Đề thi (topics)
router.route('/')
  .get(getTests) // Public
  .post(protect, adminProtect, createTest); // Chỉ Admin mới tạo được đề thi

router.route('/:slug')
  .get(protect, getTestBySlug); // Lấy chi tiết đề thi và câu hỏi (Private: cần đăng nhập)

router.route('/:testId/answers')
  .get(protect, getTestAnswers); // Lấy đáp án của đề thi (Private: cần đăng nhập)

router.route('/:id')
  .put(protect, adminProtect, updateTest)    // Chỉ Admin mới cập nhật được đề thi
  .delete(protect, adminProtect, deleteTest); // Chỉ Admin mới xóa được đề thi

// Routes cho Câu hỏi Đề thi (Quản lý riêng từng câu hỏi)
router.route('/:testId/questions') // Tạo câu hỏi cho một đề thi cụ thể
  .post(protect, adminProtect, createTestQuestion);

router.route('/questions/:id') // Cập nhật/Xóa một câu hỏi cụ thể
  .put(protect, adminProtect, updateTestQuestion)
  .delete(protect, adminProtect, deleteTestQuestion);

module.exports = router;
