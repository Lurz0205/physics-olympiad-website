// physics-olympiad-website/backend/routes/exercise.js
const express = require('express');
const router = express.Router();
const {
  getAllExercises,
  getExerciseBySlug,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');
const protect = require('../middleware/authMiddleware'); // Middleware bảo vệ (kiểm tra đăng nhập)
const adminProtect = require('../middleware/adminAuthMiddleware'); // Middleware bảo vệ admin

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

module.exports = router;
