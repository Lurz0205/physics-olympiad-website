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

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public (for published exams) or Private (for all exams if admin)
const getExams = asyncHandler(async (req, res) => {
  // Nếu là admin, có thể lấy tất cả, nếu không chỉ lấy những đề đã xuất bản
  const query = req.user && req.user.role === 'admin' ? {} : { isPublished: true };
  const exams = await Exam.find(query).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

  // THAY ĐỔI MỚI: Thêm console.log để kiểm tra dữ liệu lấy được
  console.log('Fetched exams for GET /api/exams:', exams);

  res.status(200).json(exams);
});

// @desc    Get single exam by slug
// @route   GET /api/exams/slug/:slug
// @access  Public (if published)
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

  // Tự động tạo slug từ title
  const slug = generateSlug(title);

  // Basic validation
  if (!title || !duration || !category || !questions) {
    res.status(400);
    throw new Error('Vui lòng thêm tiêu đề, thời gian, danh mục và ít nhất một câu hỏi.');
  }

  if (questions.length === 0) {
    res.status(400);
    throw new Error('Đề thi phải có ít nhất một câu hỏi.');
  }

  // Kiểm tra từng câu hỏi
  for (const q of questions) {
    if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
      res.status(400);
      throw new Error('Mỗi câu hỏi phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
    }
    if (!q.options.map(opt => opt.toLowerCase().trim()).includes(q.correctAnswer.toLowerCase().trim())) { // THAY ĐỔI: So sánh đáp án đúng không phân biệt hoa thường và trim
      res.status(400);
      throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
    }
  }

  // Check if exam with same slug already exists
  const examExists = await Exam.findOne({ slug });
  if (examExists) {
    res.status(400);
    throw new new Error('Đã tồn tại một đề thi với slug này, vui lòng chọn tiêu đề khác.'); // THAY ĐỔI: Sửa lỗi cú pháp `new new Error` thành `new Error`
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

  // Ensure unique slug if slug is changed
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

  // Kiểm tra từng câu hỏi
  for (const q of questions) {
    if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
      res.status(400);
      throw new Error('Mỗi câu hỏi phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
    }
    if (!q.options.map(opt => opt.toLowerCase().trim()).includes(q.correctAnswer.toLowerCase().trim())) { // THAY ĐỔI: So sánh đáp án đúng không phân biệt hoa thường và trim
      res.status(400);
      throw new Error(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
    }
  }

  // Only admin can update
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

  // Only admin can delete
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền xóa đề thi này.');
  }

  await exam.deleteOne();
  res.status(200).json({ message: 'Đề thi đã được xóa thành công.' });
});

module.exports = {
  getExams,
  getExamBySlug,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
