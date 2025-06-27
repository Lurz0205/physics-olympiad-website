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
  const exams = await Exam.find({}).sort({ createdAt: -1 }); 
  console.log('Fetched ALL exams for Admin GET /api/exams:', exams); 
  res.status(200).json(exams);
});

// @desc    Get published exams (for Public view)
// @route   GET /api/exams/public (This route will be public)
// @access  Public
const getPublicExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ isPublished: true }).sort({ createdAt: -1 }); 
  console.log('Fetched PUBLISHED exams for Public GET /api/exams/public:', exams); 
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

// Hàm hỗ trợ validation cho từng loại câu hỏi
const validateQuestion = (question) => {
  const { type, questionText, options, multipleChoiceCorrectAnswer, statements, shortAnswerCorrectAnswer } = question;

  if (!questionText || questionText.trim() === '') {
    return 'Nội dung câu hỏi không được để trống.';
  }

  switch (type) {
    case 'multiple-choice':
      if (!options || options.filter(opt => opt.trim() !== '').length < 2) {
        return 'Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn đã điền.';
      }
      if (!multipleChoiceCorrectAnswer || multipleChoiceCorrectAnswer.trim() === '') {
        return 'Vui lòng cung cấp đáp án đúng cho câu hỏi trắc nghiệm.';
      }
      if (!options.map(opt => opt.toLowerCase().trim()).includes(multipleChoiceCorrectAnswer.toLowerCase().trim())) {
        return `Đáp án đúng "${multipleChoiceCorrectAnswer}" không phải là một lựa chọn hợp lệ.`;
      }
      break;
    case 'true-false':
      if (!statements || statements.length !== 4) {
        return 'Câu hỏi Đúng/Sai phải có đúng 4 ý.';
      }
      for (const stmt of statements) {
        if (!stmt.statementText || stmt.statementText.trim() === '') {
          return 'Nội dung của một ý trong câu hỏi Đúng/Sai không được để trống.';
        }
        if (typeof stmt.isCorrect !== 'boolean') { // Kiểm tra kiểu boolean rõ ràng
          return 'Đáp án Đúng/Sai cho mỗi ý phải là Đúng hoặc Sai.';
        }
      }
      break;
    case 'short-answer':
      if (!shortAnswerCorrectAnswer || shortAnswerCorrectAnswer.trim() === '') {
        return 'Vui lòng cung cấp đáp án cho câu hỏi trả lời ngắn.';
      }
      // Regex: chỉ chứa số (0-9), dấu "-" và dấu ",". Tối đa 4 ký tự.
      if (!/^[0-9,-]{1,4}$/.test(shortAnswerCorrectAnswer.trim())) {
        return 'Đáp án trả lời ngắn phải có tối đa 4 ký tự và chỉ chứa số (0-9), dấu "-" và dấu ",".';
      }
      break;
    default:
      return 'Loại câu hỏi không hợp lệ.';
  }
  return null; // Không có lỗi
};


// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin only)
const createExam = asyncHandler(async (req, res) => {
  const { title, description, duration, category, questions, isPublished } = req.body;

  const slug = generateSlug(title);

  // Validate overall exam fields
  if (!title || !duration || !category) {
    res.status(400);
    throw new Error('Vui lòng thêm tiêu đề, thời gian, và danh mục.');
  }

  // Validate questions array
  if (!questions || questions.length === 0) {
    res.status(400);
    throw new Error('Đề thi phải có ít nhất một câu hỏi.');
  }

  // Validate each question individually
  for (const q of questions) {
    const validationError = validateQuestion(q);
    if (validationError) {
      res.status(400);
      throw new Error(`Lỗi ở câu hỏi: ${validationError}`);
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
    questions, // Mongoose sẽ tự động áp dụng schema con và validation
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

  // Validate slug uniqueness only if it's changed and conflicts with another exam
  if (slug && slug !== exam.slug) {
    const slugExists = await Exam.findOne({ slug });
    if (slugExists && slugExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Đã tồn tại một đề thi khác với slug này.');
    }
  }

  // Validate questions array
  if (!questions || questions.length === 0) {
    res.status(400);
    throw new Error('Đề thi phải có ít nhất một câu hỏi.');
  }

  // Validate each question individually
  for (const q of questions) {
    const validationError = validateQuestion(q);
    if (validationError) {
      res.status(400);
      throw new Error(`Lỗi ở câu hỏi: ${validationError}`);
    }
  }

  // Update exam fields
  exam.title = title || exam.title;
  exam.slug = slug || exam.slug;
  exam.description = description !== undefined ? description : exam.description;
  exam.duration = duration || exam.duration;
  exam.category = category || exam.category;
  exam.questions = questions; // Cập nhật mảng câu hỏi
  exam.isPublished = isPublished !== undefined ? isPublished : exam.isPublished;

  const updatedExam = await exam.save(); // Sử dụng .save() để kích hoạt validation của schema con

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

  // Admin access is handled by middleware, so no need for req.user check here.
  // The check for `req.user.role !== 'admin'` in previous versions was redundant
  // because the route itself is protected by adminAuthMiddleware.
  // if (!req.user || req.user.role !== 'admin') {
  //   res.status(403);
  //   throw new Error('Không có quyền xóa đề thi này.');
  // }

  await exam.deleteOne();
  res.status(200).json({ message: 'Đề thi đã được xóa thành công.' });
});

module.exports = {
  getAdminExams,
  getPublicExams,
  getExamBySlug,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
