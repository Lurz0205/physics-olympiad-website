// physics-olympiad-website/backend/controllers/examResultController.js
const ExamResult = require('../models/ExamResult');
const Exam = require('../models/Exam');
const asyncHandler = require('express-async-handler');

// @desc    Submit an exam result
// @route   POST /api/exam-results
// @access  Private (Authenticated users)
const submitExamResult = asyncHandler(async (req, res) => {
  const { examId, userAnswers, timeTaken } = req.body; // userAnswers is an array { questionId, userAnswer }

  if (!examId || !userAnswers || !Array.isArray(userAnswers) || timeTaken === undefined) {
    res.status(400);
    throw new Error('Dữ liệu gửi lên không hợp lệ.');
  }

  const exam = await Exam.findById(examId);

  if (!exam) {
    res.status(404);
    throw new Error('Đề thi không tìm thấy.');
  }

  let totalScoreAchieved = 0; // Tổng điểm mà người dùng đạt được
  let maxPossibleScoreOverall = 0;   // Tổng điểm tối đa có thể đạt được của đề thi (trên thang điểm thực)

  let correctAnswersCount = 0; // Tổng số câu đúng hoàn toàn (cho thống kê)
  let incorrectAnswersCount = 0; // Tổng số câu sai hoàn toàn (cho thống kê)

  const processedUserAnswers = []; // Will store detailed user answers and correct/incorrect status for each question

  // Lấy cấu hình điểm từ đề thi, nếu không có thì dùng mặc định
  const scoringConfig = exam.scoringConfig || {
    multipleChoice: 0.25,
    shortAnswer: 0.5,
    trueFalse: {
      '1': 0.1,
      '2': 0.25,
      '3': 0.5,
      '4': 1
    }
  };

  // Logic chấm điểm cho từng loại câu hỏi
  exam.questions.forEach(examQuestion => {
    const userResponse = userAnswers.find(ua => ua.questionId === examQuestion._id.toString());
    let isQuestionCorrectOverall = false; // Flag indicating if this entire question is correct (used for correct/incorrectAnswersCount)
    let scoreForThisQuestion = 0; // Điểm đạt được cho câu hỏi hiện tại

    // Tính điểm tối đa cho câu hỏi này để cộng vào maxPossibleScoreOverall
    switch (examQuestion.type) {
      case 'multiple-choice':
        maxPossibleScoreOverall += scoringConfig.multipleChoice;
        break;
      case 'short-answer':
        maxPossibleScoreOverall += scoringConfig.shortAnswer;
        break;
      case 'true-false':
        maxPossibleScoreOverall += scoringConfig.trueFalse['4']; // Điểm tối đa cho Đúng/Sai là khi đúng cả 4 ý
        break;
      default:
        // Nếu loại câu hỏi không xác định, không cộng điểm vào maxPossibleScoreOverall
        break;
    }

    if (!userResponse || (userResponse.userAnswer === null || userResponse.userAnswer === undefined || userResponse.userAnswer === '')) {
      // If user doesn't answer or answers empty, count as incorrect for all question types
      isQuestionCorrectOverall = false;
      scoreForThisQuestion = 0; // scoreForThisQuestion remains 0
    } else {
      switch (examQuestion.type) {
        case 'multiple-choice':
          // Multiple-choice answer: direct string comparison (case-insensitive, trimmed)
          isQuestionCorrectOverall = userResponse.userAnswer.trim().toLowerCase() === examQuestion.multipleChoiceCorrectAnswer.trim().toLowerCase();
          if (isQuestionCorrectOverall) {
            scoreForThisQuestion = scoringConfig.multipleChoice;
          }
          break;

        case 'true-false':
          // True/False answer: need to compare each statement
          let userStatementsArray;
          let correctStatementsInTF = 0; // Counter for correctly answered statements in a True/False question
          try {
            userStatementsArray = JSON.parse(userResponse.userAnswer); // Frontend sends JSON string of boolean array
            if (!Array.isArray(userStatementsArray) || userStatementsArray.length !== 4) {
              isQuestionCorrectOverall = false; // Incorrect format also counts as wrong
            } else {
              // Compare each statement
              examQuestion.statements.forEach((stmt, index) => {
                // Backend stores isCorrect as boolean, Frontend sends boolean after JSON parse
                if (stmt.isCorrect === userStatementsArray[index]) {
                  correctStatementsInTF++;
                }
              });
              // Determine score for True/False based on correctStatementsInTF
              // Use scoringConfig.trueFalse to get score, default to 0 if not defined for a specific count
              scoreForThisQuestion = scoringConfig.trueFalse[correctStatementsInTF.toString()] || 0;
              // For correctAnswersCount/incorrectAnswersCount, True/False is considered correct only if all 4 are correct
              isQuestionCorrectOverall = (correctStatementsInTF === 4); 
            }
          } catch (e) {
            // If JSON cannot be parsed, count as wrong
            console.error("Error parsing true-false user answer JSON:", e);
            isQuestionCorrectOverall = false;
            scoreForThisQuestion = 0;
          }
          break;

        case 'short-answer':
          // Short answer: direct string comparison (case-insensitive, trimmed)
          isQuestionCorrectOverall = userResponse.userAnswer.trim().toLowerCase() === examQuestion.shortAnswerCorrectAnswer.trim().toLowerCase();
          if (isQuestionCorrectOverall) {
            scoreForThisQuestion = scoringConfig.shortAnswer;
          }
          break;

        default:
          // Unknown question type, count as wrong
          isQuestionCorrectOverall = false;
          scoreForThisQuestion = 0;
          break;
      }
    }

    // Accumulate total score
    totalScoreAchieved += scoreForThisQuestion;

    // For overall correct/incorrect count (statistical purposes)
    if (isQuestionCorrectOverall) {
      correctAnswersCount++;
    } else {
      incorrectAnswersCount++;
    }

    processedUserAnswers.push({
      questionId: examQuestion._id,
      userAnswer: userResponse ? userResponse.userAnswer : '', // Store original user answer
      isCorrect: isQuestionCorrectOverall, // Overall correct/incorrect status of the question (True for full score, False otherwise)
      scoreAchieved: scoreForThisQuestion // Điểm người dùng đạt được cho câu này
    });
  });

  const totalQuestions = exam.questions.length;
  
  // ===================== SỬA LỖI LÀM TRÒN ĐIỂM =====================
  // finalScore là điểm quy đổi về thang 10
  let finalScore = 0; 
  if (maxPossibleScoreOverall > 0) {
      finalScore = (totalScoreAchieved / maxPossibleScoreOverall) * 10;
  }
  // Giữ nguyên là số, không làm tròn bằng toFixed ở đây
  finalScore = Math.max(0, finalScore); 
  // =================================================================

  const examResult = await ExamResult.create({
    user: req.user.id,
    exam: exam._id,
    examTitle: exam.title,
    examSlug: exam.slug,
    score: finalScore, // Lưu điểm dưới dạng số float
    totalQuestions,
    correctAnswersCount,
    incorrectAnswersCount,
    timeTaken,
    userAnswers: processedUserAnswers,
    maxPossibleScore: maxPossibleScoreOverall // Lưu tổng điểm tối đa thực tế (số float)
  });

  res.status(201).json(examResult);
});

// @desc    Get user's exam results (history)
// @route   GET /api/exam-results/me
// @access  Private (Authenticated users)
const getMyExamResults = asyncHandler(async (req, res) => {
  const results = await ExamResult.find({ user: req.user.id })
    .populate('exam', 'title slug duration category questions scoringConfig') // Populate scoringConfig too
    .sort({ createdAt: -1 });

  res.status(200).json(results);
});

// @desc    Get a single exam result by ID
// @route   GET /api/exam-results/:id
// @access  Private (Authenticated user who owns the result, or Admin)
const getExamResultById = asyncHandler(async (req, res) => {
  // Populate exam with all necessary fields, including questions and scoringConfig
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
