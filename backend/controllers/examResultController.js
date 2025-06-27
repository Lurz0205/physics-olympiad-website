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

  const exam = await Exam.findById(examId);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy.');
  }

  let correctAnswersCount = 0;
  let incorrectAnswersCount = 0;
  const processedUserAnswers = []; // Sẽ lưu trữ chi tiết đáp án của người dùng và trạng thái đúng/sai của từng câu hỏi

  // Logic chấm điểm cho từng loại câu hỏi
  exam.questions.forEach(examQuestion => {
    const userResponse = userAnswers.find(ua => ua.questionId === examQuestion._id.toString());
    let isQuestionCorrectOverall = false; // Biến cờ cho biết toàn bộ câu hỏi này có đúng hay không

    if (!userResponse || (userResponse.userAnswer === null || userResponse.userAnswer === undefined || userResponse.userAnswer === '')) {
      // Nếu người dùng không trả lời hoặc trả lời rỗng, coi là sai cho mọi loại câu hỏi
      isQuestionCorrectOverall = false;
    } else {
        switch (examQuestion.type) {
            case 'multiple-choice':
                // Đáp án trắc nghiệm: so sánh trực tiếp chuỗi (không phân biệt hoa/thường, trim)
                isQuestionCorrectOverall = userResponse.userAnswer.trim().toLowerCase() === examQuestion.multipleChoiceCorrectAnswer.trim().toLowerCase();
                break;

            case 'true-false':
                // Đáp án Đúng/Sai: cần so sánh từng ý
                let userStatementsArray;
                try {
                    userStatementsArray = JSON.parse(userResponse.userAnswer); // Frontend gửi về là JSON string của mảng boolean
                    if (!Array.isArray(userStatementsArray) || userStatementsArray.length !== 4) {
                        isQuestionCorrectOverall = false; // Format không đúng cũng coi là sai
                    } else {
                        // So sánh từng ý
                        isQuestionCorrectOverall = examQuestion.statements.every((stmt, index) => {
                            // Backend lưu isCorrect là boolean, Frontend gửi về boolean sau khi parse JSON
                            return stmt.isCorrect === userStatementsArray[index];
                        });
                    }
                } catch (e) {
                    // Nếu không parse được JSON, coi là sai
                    console.error("Error parsing true-false user answer JSON:", e);
                    isQuestionCorrectOverall = false;
                }
                break;

            case 'short-answer':
                // Đáp án trả lời ngắn: so sánh trực tiếp chuỗi (không phân biệt hoa/thường, trim)
                isQuestionCorrectOverall = userResponse.userAnswer.trim().toLowerCase() === examQuestion.shortAnswerCorrectAnswer.trim().toLowerCase();
                break;

            default:
                // Loại câu hỏi không xác định, coi là sai
                isQuestionCorrectOverall = false;
                break;
        }
    }

    if (isQuestionCorrectOverall) {
      correctAnswersCount++;
    } else {
      incorrectAnswersCount++;
    }

    processedUserAnswers.push({
      questionId: examQuestion._id,
      userAnswer: userResponse ? userResponse.userAnswer : '', // Lưu câu trả lời gốc của người dùng
      isCorrect: isQuestionCorrectOverall, // Kết quả đúng/sai tổng thể của câu hỏi
    });
  });

  const totalQuestions = exam.questions.length;
  // Điểm số đơn giản: số câu đúng / tổng số câu * 10
  const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 10 : 0;

  const examResult = await ExamResult.create({
    user: req.user.id, 
    exam: exam._id,
    examTitle: exam.title,
    examSlug: exam.slug,
    score: score.toFixed(2), 
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
    .populate('exam', 'title slug duration category questions') // Lấy thêm trường questions để xem lại đáp án
    .sort({ createdAt: -1 }); 

  res.status(200).json(results);
});

// @desc    Get a single exam result by ID
// @route   GET /api/exam-results/:id
// @access  Private (Authenticated user who owns the result, or Admin)
const getExamResultById = asyncHandler(async (req, res) => {
  // Populate exam với tất cả các trường cần thiết, bao gồm questions
  const result = await ExamResult.findById(req.params.id).populate('exam'); 

  if (!result) {
    res.status(404);
    throw new Error('Kết quả bài thi không tìm thấy.');
  }

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
