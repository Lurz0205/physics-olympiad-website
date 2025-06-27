// physics-olympiad-website/backend/controllers/examController.js
const Exam = require('../models/Exam');
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
    .replace(/--+/g, '-');
};

// @desc    Get ALL exams (for Admin Panel)
// @route   GET /api/exams (This route will be protected for admin access)
// @access  Private (Admin only)
const getAdminExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({}).sort({ createdAt: -1 }); // Lấy tất cả đề thi
  console.log('Fetched ALL exams for Admin GET /api/exams:', exams); // Gỡ lỗi
  res.status(200).json(exams);
});

// @desc    Get published exams (for Public view)
// @route   GET /api/exams/public (This route will be public)
// @access  Public
const getPublicExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ isPublished: true }).sort({ createdAt: -1 }); // Chỉ lấy đề đã xuất bản
  console.log('Fetched PUBLISHED exams for Public GET /api/exams/public:', exams); // Gỡ lỗi
  res.status(200).json(exams);
});

// @desc    Get single exam by slug
// @route   GET /api/exams/slug/:slug
// @access  Public (if published) or Private (if admin)
const getExamBySlug = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ slug: req.params.slug });

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy');
  }

  // Nếu không phải admin, kiểm tra xem đề thi đã xuất bản chưa
  if (!req.user || req.user.role !== 'admin') {
    if (!exam.isPublished) {
      res.status(403); // Forbidden
      throw new Error('Đề thi này chưa được xuất bản và bạn không có quyền truy cập.');
    }
  }

  res.status(200).json(exam);
});

// @desc    Get single exam by ID (for admin edit)
// @route   GET /api/exams/:id
// @access  Private (Admin only)
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy');
  }

  res.status(200).json(exam);
});

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin only)
const createExam = asyncHandler(async (req, res) => {
  const { title, description, duration, category, questions, isPublished } = req.body;

  const slug = generateSlug(title);

  if (!title || !duration || !category || !questions) {
    res.status(400);
    throw new Error('Vui lòng thêm tiêu đề, thời gian, danh mục và ít nhất một câu hỏi.');
  }

  if (questions.length === 0) {
    res.status(400);
    throw new Error('Đề thi phải có ít nhất một câu hỏi.');
  }

  for (const q of questions) {
    if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
      res.status(400);
      throw new Error('Mỗi câu hỏi phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
    }
    if (!q.options.map(opt => opt.toLowerCase().trim()).includes(q.correctAnswer.toLowerCase().trim())) {
      res.status(400);
      throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
    }
  }

  const examExists = await Exam.findOne({ slug });
  if (examExists) {
    res.status(400);
    throw new Error('Đã tồn tại một đề thi với slug này, vui lòng chọn tiêu đề khác.');
  }

  const exam = await Exam.create({
    title,
    slug,
    description,
    duration,
    category,
    questions,
    user: req.user ? req.user.id : null,
    isPublished: isPublished || false,
  });

  res.status(201).json(exam);
});

// @desc    Update an exam
// @route   PUT /api/exams/:id
// @access  Private (Admin only)
const updateExam = asyncHandler(async (req, res) => {
  const { title, slug, description, duration, category, questions, isPublished } = req.body;

  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy');
  }

  if (slug && slug !== exam.slug) {
    const slugExists = await Exam.findOne({ slug });
    if (slugExists && slugExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Đã tồn tại một đề thi khác với slug này.');
    }
  }

  if (questions.length === 0) {
    res.status(400);
    throw new Error('Đề thi phải có ít nhất một câu hỏi.');
  }

  for (const q of questions) {
    if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
      res.status(400);
      throw new Error('Mỗi câu hỏi phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
    }
    if (!q.options.map(opt => opt.toLowerCase().trim()).includes(q.correctAnswer.toLowerCase().trim())) {
      res.status(400);
      throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
    }
  }

  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền cập nhật đề thi này.');
  }

  const updatedExam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedExam);
});

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin only)
const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy');
  }

  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền xóa đề thi này.');
  }

  await exam.deleteOne();
  res.status(200).json({ message: 'Đề thi đã được xóa thành công.' });
});

module.exports = {
  getAdminExams, // THAY ĐỔI: Export hàm mới
  getPublicExams, // THAY ĐỔI: Export hàm mới
  getExamBySlug,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
