// physics-olympiad-website/backend/routes/practice.js
const express = require('express');
const router = express.Router();
const {
  getPracticeTopics,
  getPracticeQuestionsByTopicSlug,
  createPracticeTopic,
  updatePracticeTopic,
  deletePracticeTopic,
  createPracticeQuestion,
  updatePracticeQuestion,
  deletePracticeQuestion,
} = require('../controllers/practiceController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware bảo vệ admin

// Routes cho Chủ đề Bài tập
router.route('/topics')
  .get(getPracticeTopics) // Public
  .post(protect, adminProtect, createPracticeTopic); // Chỉ Admin mới tạo được chủ đề

router.route('/topics/:slug/questions')
  .get(protect, getPracticeQuestionsByTopicSlug); // Lấy câu hỏi theo slug chủ đề (Private: cần đăng nhập)

router.route('/topics/:id')
  .put(protect, adminProtect, updatePracticeTopic) // Chỉ Admin mới cập nhật được chủ đề
  .delete(protect, adminProtect, deletePracticeTopic); // Chỉ Admin mới xóa được chủ đề

// Routes cho Câu hỏi Bài tập (Quản lý riêng từng câu hỏi)
router.route('/topics/:topicId/questions') // Tạo câu hỏi cho một chủ đề cụ thể
  .post(protect, adminProtect, createPracticeQuestion);

router.route('/questions/:id') // Cập nhật/Xóa một câu hỏi cụ thể
  .put(protect, adminProtect, updatePracticeQuestion)
  .delete(protect, adminProtect, deletePracticeQuestion);

module.exports = router;
