// physics-olympiad-website/backend/routes/exercise.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController'); // THAY ĐỔI: THÊM DÒNG NÀY

const {
  getAllExercises,
  getExerciseBySlug,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getAllExerciseCategories, // Đảm bảo dòng này đã có nếu bạn đã thêm nó
} = require('../controllers/exerciseController');
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminAuthMiddleware');

// GET /api/exercises - Lấy tất cả bài tập (Public)
// POST /api/exercises - Tạo bài tập mới (Admin)
router.route('/').get(getAllExercises).post(protect, adminProtect, createExercise);

// GET /api/exercises/slug/:slug - Lấy chi tiết bài tập theo slug (Public)
router.route('/slug/:slug').get(getExerciseBySlug);

// GET /api/exercises/:id - Lấy chi tiết bài tập theo ID (Admin)
// PUT /api/exercises/:id - Cập nhật bài tập (Admin)
// DELETE /api/exercises/:id - Xóa bài tập (Admin)
router.route('/:id')
  .get(protect, adminProtect, getExerciseById)
  .put(protect, adminProtect, updateExercise)
  .delete(protect, adminProtect, deleteExercise);

// THAY ĐỔI: Route để lấy TẤT CẢ các danh mục (category) duy nhất của bài tập
// Sử dụng exerciseController đã được import
router.get('/categories', exerciseController.getAllExerciseCategories);

module.exports = router;
