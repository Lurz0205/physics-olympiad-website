// physics-olympiad-website/backend/routes/examResult.js
const express = require('express');
const router = express.Router();
const examResultController = require('../controllers/examResultController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ route

// POST /api/exam-results - Gửi kết quả làm bài
// GET /api/exam-results/me - Lấy lịch sử làm bài của người dùng hiện tại
router.route('/')
  .post(protect, examResultController.submitExamResult);

router.get('/me', protect, examResultController.getMyExamResults);

// GET /api/exam-results/:id - Lấy chi tiết một kết quả làm bài
router.route('/:id')
  .get(protect, examResultController.getExamResultById);

module.exports = router;
