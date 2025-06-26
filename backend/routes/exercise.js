// physics-olympiad-website/backend/routes/exercise.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

const {
  getAllExercises,
  getExerciseBySlug,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getAllExerciseCategories,
} = require('../controllers/exerciseController');
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminAuthMiddleware');

// THAY ĐỔI QUAN TRỌNG: Thêm protect middleware cho GET /api/exercises
// Bây giờ, để lấy tất cả bài tập, người dùng phải được xác thực.
router.route('/').get(protect, getAllExercises).post(protect, adminProtect, createExercise);

// GET /api/exercises/slug/:slug - Lấy chi tiết bài tập theo slug (Public - có thể thay đổi sau)
// THAY ĐỔI QUAN TRỌNG: Có thể thêm protect ở đây nếu bạn muốn trang chi tiết cũng yêu cầu đăng nhập
router.route('/slug/:slug').get(getExerciseBySlug); 

// GET /api/exercises/:id - Lấy chi tiết bài tập theo ID (Admin)
// PUT /api/exercises/:id - Cập nhật bài tập (Admin)
// DELETE /api/exercises/:id - Xóa bài tập (Admin)
router.route('/:id')
  .get(protect, adminProtect, getExerciseById)
  .put(protect, adminProtect, updateExercise)
  .delete(protect, adminProtect, deleteExercise);

// Route để lấy TẤT CẢ các danh mục (category) duy nhất của bài tập
// THAY ĐỔI QUAN TRỌNG: Thêm protect middleware cho /categories
router.get('/categories', protect, getAllExerciseCategories);

module.exports = router;
