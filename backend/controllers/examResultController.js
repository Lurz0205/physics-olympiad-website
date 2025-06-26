// physics-olympiad-website/backend/controllers/examResultController.js
const ExamResult = require('../models/ExamResult');
const Exam = require('../models/Exam');
const asyncHandler = require('express-async-handler');

// @desc    Submit an exam result
// @route   POST /api/exam-results
// @access  Private (Authenticated users)
const submitExamResult = asyncHandler(async (req, res) => {
  const { examId, userAnswers, timeTaken } = req.body; // userAnswers là mảng { questionId, userAnswer }

  if (!examId || !userAnswers || !Array.isArray(userAnswers) || timeTaken === undefined) {
    res.status(400);
    throw new Error('Dữ liệu gửi lên không hợp lệ.');
  }

  // Lấy thông tin đề thi gốc để chấm điểm
  const exam = await Exam.findById(examId);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy.');
  }

  let correctAnswersCount = 0;
  let incorrectAnswersCount = 0;
  const processedUserAnswers = [];

  // Logic chấm điểm
  exam.questions.forEach(examQuestion => {
    const userResponse = userAnswers.find(ua => ua.questionId === examQuestion._id.toString()); // Chuyển _id sang string để so sánh
    let isCorrect = false;

    if (userResponse) {
      // So sánh đáp án (không phân biệt hoa thường và trim khoảng trắng)
      if (typeof userResponse.userAnswer === 'string' && typeof examQuestion.correctAnswer === 'string') {
        isCorrect = userResponse.userAnswer.trim().toLowerCase() === examQuestion.correctAnswer.trim().toLowerCase();
      }
    } else {
      // Người dùng không trả lời câu này, coi là sai
      isCorrect = false;
    }

    if (isCorrect) {
      correctAnswersCount++;
    } else {
      incorrectAnswersCount++;
    }

    processedUserAnswers.push({
      questionId: examQuestion._id,
      userAnswer: userResponse ? userResponse.userAnswer : '', // Lưu câu trả lời của người dùng (rỗng nếu không trả lời)
      isCorrect: isCorrect,
    });
  });

  const totalQuestions = exam.questions.length;
  // Điểm số đơn giản: số câu đúng / tổng số câu * 10
  const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 10 : 0;

  const examResult = await ExamResult.create({
    user: req.user.id, // ID của người dùng đang đăng nhập
    exam: exam._id,
    examTitle: exam.title,
    examSlug: exam.slug,
    score: score.toFixed(2), // Làm tròn 2 chữ số thập phân
    totalQuestions,
    correctAnswersCount,
    incorrectAnswersCount,
    timeTaken,
    userAnswers: processedUserAnswers,
  });

  res.status(201).json(examResult);
});

// @desc    Get user's exam results (history)
// @route   GET /api/exam-results/me
// @access  Private (Authenticated users)
const getMyExamResults = asyncHandler(async (req, res) => {
  const results = await ExamResult.find({ user: req.user.id })
    .populate('exam', 'title slug duration category') // Lấy thêm thông tin đề thi
    .sort({ createdAt: -1 }); // Sắp xếp từ mới nhất

  res.status(200).json(results);
});

// @desc    Get a single exam result by ID
// @route   GET /api/exam-results/:id
// @access  Private (Authenticated user who owns the result, or Admin)
const getExamResultById = asyncHandler(async (req, res) => {
  const result = await ExamResult.findById(req.params.id).populate('exam'); // Populate để có thông tin đề thi đầy đủ

  if (!result) {
    res.status(404);
    throw new Error('Kết quả bài thi không tìm thấy.');
  }

  // Đảm bảo chỉ người dùng sở hữu hoặc admin mới có thể xem kết quả này
  if (result.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Bạn không có quyền xem kết quả bài thi này.');
  }

  res.status(200).json(result);
});

module.exports = {
  submitExamResult,
  getMyExamResults,
  getExamResultById,
};
