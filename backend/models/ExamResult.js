// physics-olympiad-website/backend/models/ExamResult.js
const mongoose = require('mongoose');

// Schema for each user answer in an exam
const userAnswerSchema = mongoose.Schema({
  questionId: { // ID of the question in the original exam (will be _id of the question subdocument)
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userAnswer: { // User's selected/entered answer
    type: String,
    required: true,
  },
  isCorrect: { // Result: correct or incorrect overall for the question
    type: Boolean,
    required: true,
  },
  scoreAchieved: { // Points achieved for this specific question
    type: Number,
    required: false, // Not strictly required for old data, but good to have
    default: 0,
  }
});

// Schema for an exam submission result
const examResultSchema = mongoose.Schema(
  {
    user: { // User who took the exam
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    exam: { // Exam taken
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exam',
    },
    examTitle: { // Exam title at the time of submission (for quick display)
      type: String,
      required: true,
    },
    examSlug: { // Exam slug at the time of submission
      type: String,
      required: true,
    },
    score: { // Achieved score (e.g., on a 10-point scale, or total points if preferred)
      type: Number,
      required: true,
      min: 0,
    },
    // ============ THÊM TRƯỜNG MỚI NÀY ============
    maxPossibleScore: { // Maximum possible score for the exam based on its scoringConfig
      type: Number,
      required: true, // This field is now required to match backend logic
      min: 0,
    },
    // ============================================
    totalQuestions: { // Total number of questions in the exam
      type: Number,
      required: true,
      min: 0,
    },
    correctAnswersCount: { // Number of questions answered correctly (overall)
      type: Number,
      required: true,
      min: 0,
    },
    incorrectAnswersCount: { // Number of questions answered incorrectly (overall)
      type: Number,
      required: true,
      min: 0,
    },
    timeTaken: { // Time taken to complete the exam (in seconds)
      type: Number,
      required: true,
      min: 0,
    },
    userAnswers: { // Array of user's answers
      type: [userAnswerSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Add createdAt, updatedAt
  }
);

module.exports = mongoose.model('ExamResult', examResultSchema);
