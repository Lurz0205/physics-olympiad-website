// physics-olympiad-website/backend/controllers/exerciseController.js
const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler');

// Helper function to generate slug
const generateSlug = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g/g, '-');
};

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private (Authenticated users)
const getAllExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({}).sort({ createdAt: -1 });
  res.status(200).json(exercises);
});

// @desc    Get single exercise by slug
// @route   GET /api/exercises/slug/:slug
// @access  Public
const getExerciseBySlug = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findOne({ slug: req.params.slug });

  if (!exercise) {
    res.status(404);
    throw new Error('Bài tập không tìm thấy');
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
    throw new Error('Bài tập không tìm thấy');
  }

  res.status(200).json(exercise);
});

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private (Admin only)
const createExercise = asyncHandler(async (req, res) => {
  const { title, description, problemStatement, solution, category, difficulty, tags, type, questions } = req.body;

  const slug = generateSlug(title); // Tự động tạo slug

  // Basic validation
  if (!title || !problemStatement || !category || !difficulty || !type) {
    res.status(400);
    throw new Error('Vui lòng điền đầy đủ các trường bắt buộc: Tiêu đề, Đề bài, Danh mục, Độ khó, Loại bài tập.');
  }

  // Check if exercise with same slug already exists
  const exerciseExists = await Exercise.findOne({ slug });
  if (exerciseExists) {
    res.status(400);
    throw new Error('Một bài tập với slug này đã tồn tại.');
  }

  // Validation logic based on type
  if (type === 'Trắc nghiệm') {
    if (!questions || questions.length === 0) {
      res.status(400);
      throw new Error('Bài tập trắc nghiệm phải có ít nhất một câu hỏi.');
    }
    for (const q of questions) {
      if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
        res.status(400);
        throw new Error('Mỗi câu hỏi trắc nghiệm phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
      }
      if (!q.options.includes(q.correctAnswer)) {
        res.status(400);
        throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
      }
    }
    // Đối với trắc nghiệm, giải pháp đầy đủ không bắt buộc vì lời giải nằm ở từng câu hỏi
    // nhưng để tránh lỗi validate schema, ta vẫn giữ default rỗng
  } else if (type === 'Tự luận') {
    // Với tự luận, solution có thể rỗng hoặc không
    // Không cần validation đặc biệt cho questions ở đây
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
    type, // Lưu loại bài tập
    questions, // Lưu các câu hỏi nếu là trắc nghiệm
    user: req.user ? req.user.id : null,
  });

  res.status(201).json(exercise);
});

// @desc    Update an exercise
// @route   PUT /api/exercises/:id
// @access  Private (Admin only)
const updateExercise = asyncHandler(async (req, res) => {
  const { title, slug, description, problemStatement, solution, category, difficulty, tags, type, questions } = req.body;

  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Bài tập không tìm thấy');
  }

  // Ensure unique slug if slug is changed
  if (slug && slug !== exercise.slug) {
    const slugExists = await Exercise.findOne({ slug });
    if (slugExists && slugExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Một bài tập khác với slug này đã tồn tại.');
    }
  }

  // Validation logic based on type for update
  if (type === 'Trắc nghiệm') {
    if (!questions || questions.length === 0) {
      res.status(400);
      throw new Error('Bài tập trắc nghiệm phải có ít nhất một câu hỏi.');
    }
    for (const q of questions) {
      if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
        res.status(400);
        throw new Error('Mỗi câu hỏi trắc nghiệm phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
      }
      if (!q.options.includes(q.correctAnswer)) {
        res.status(400);
        throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
      }
    }
  } else if (type === 'Tự luận') {
    // Không cần validation đặc biệt cho questions ở đây
  }


  // Only admin can update
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền cập nhật bài tập này.');
  }

  const updatedExercise = await Exercise.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
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
    throw new Error('Bài tập không tìm thấy');
  }

  // Only admin can delete
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền xóa bài tập này.');
  }

  await exercise.deleteOne();
  res.status(200).json({ message: 'Bài tập đã được xóa thành công.' });
});

// @desc    Get all unique exercise categories
// @route   GET /api/exercises/categories
// @access  Private (Authenticated users)
const getAllExerciseCategories = asyncHandler(async (req, res) => {
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
});


module.exports = {
  getAllExercises,
  getExerciseBySlug,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getAllExerciseCategories,
};
