// physics-olympiad-website/backend/controllers/exerciseController.js
const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler'); // Helper để bắt lỗi async/await

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
const getAllExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({});
  res.status(200).json(exercises);
});

// @desc    Get single exercise by slug
// @route   GET /api/exercises/slug/:slug
// @access  Public
const getExerciseBySlug = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findOne({ slug: req.params.slug });

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  res.status(200).json(exercise);
});

// @desc    Get single exercise by ID (for admin edit)
// @route   GET /api/exercises/:id
// @access  Private (Admin only)
const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  res.status(200).json(exercise);
});

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private (Admin only)
const createExercise = asyncHandler(async (req, res) => {
  const { title, slug, description, problemStatement, solution, category, difficulty, tags } = req.body;

  // Basic validation
  if (!title || !slug || !problemStatement || !category || !difficulty) {
    res.status(400);
    throw new Error('Please include all required fields: title, slug, problem statement, category, and difficulty');
  }

  // Check if exercise with same slug already exists
  const exerciseExists = await Exercise.findOne({ slug });
  if (exerciseExists) {
    res.status(400);
    throw new Error('An exercise with this slug already exists');
  }

  const exercise = await Exercise.create({
    title,
    slug,
    description,
    problemStatement,
    solution,
    category,
    difficulty,
    tags,
    user: req.user ? req.user.id : null, // Gán user ID nếu có (từ middleware protect)
  });

  res.status(201).json(exercise);
});

// @desc    Update an exercise
// @route   PUT /api/exercises/:id
// @access  Private (Admin only)
const updateExercise = asyncHandler(async (req, res) => {
  const { title, slug, description, problemStatement, solution, category, difficulty, tags } = req.body;

  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  // Ensure unique slug if slug is changed
  if (slug && slug !== exercise.slug) {
    const slugExists = await Exercise.findOne({ slug });
    if (slugExists && slugExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Another exercise with this slug already exists');
    }
  }

  // Only admin can update
  if (!req.user || req.user.role !== 'admin') { // req.user được set bởi protect middleware
    res.status(403);
    throw new Error('Not authorized to update this exercise');
  }

  const updatedExercise = await Exercise.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true } // Return the updated document and run schema validators
  );

  res.status(200).json(updatedExercise);
});

// @desc    Delete an exercise
// @route   DELETE /api/exercises/:id
// @access  Private (Admin only)
const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  // Only admin can delete
  if (!req.user || req.user.role !== 'admin') { // req.user được set bởi protect middleware
    res.status(403);
    throw new Error('Not authorized to delete this exercise');
  }

  await exercise.deleteOne(); // Sử dụng deleteOne() thay vì remove()

  res.status(200).json({ message: 'Exercise removed successfully' });
});

// @desc    Get all unique exercise categories
// @route   GET /api/exercises/categories
// @access  Public
const getAllExerciseCategories = async (req, res) => {
  try {
    const categories = await Exercise.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      },
      {
        $sort: { category: 1 }
      }
    ]);
    const categoryNames = categories.map(cat => cat.category);
    res.status(200).json(categoryNames);
  } catch (error) {
    console.error('Error fetching exercise categories:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh mục bài tập.' });
  }
};


module.exports = {
  getAllExercises, // THAY ĐỔI: Sửa từ getExercises thành getAllExercises
  getExerciseBySlug,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getAllExerciseCategories,
};
