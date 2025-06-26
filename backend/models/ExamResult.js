// physics-olympiad-website/backend/models/ExamResult.js
const mongoose = require('mongoose');

// Schema cho mỗi câu trả lời của người dùng trong một đề thi
const userAnswerSchema = mongoose.Schema({
  questionId: { // ID của câu hỏi trong đề thi gốc (sẽ là _id của subdocument question)
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userAnswer: { // Đáp án người dùng chọn/nhập
    type: String,
    required: true,
  },
  isCorrect: { // Kết quả: đúng hay sai
    type: Boolean,
    required: true,
  },
});

// Schema cho kết quả làm bài của một đề thi
const examResultSchema = mongoose.Schema(
  {
    user: { // Người dùng làm bài
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    exam: { // Đề thi đã làm
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exam',
    },
    examTitle: { // Tiêu đề đề thi tại thời điểm làm bài (để hiển thị nhanh)
      type: String,
      required: true,
    },
    examSlug: { // Slug đề thi tại thời điểm làm bài
      type: String,
      required: true,
    },
    score: { // Điểm số đạt được
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: { // Tổng số câu hỏi trong đề thi
      type: Number,
      required: true,
      min: 0,
    },
    correctAnswersCount: { // Số câu trả lời đúng
      type: Number,
      required: true,
      min: 0,
    },
    incorrectAnswersCount: { // Số câu trả lời sai
      type: Number,
      required: true,
      min: 0,
    },
    // unansweredQuestionsCount: { // Có thể thêm nếu muốn theo dõi câu chưa trả lời
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    timeTaken: { // Thời gian làm bài (tính bằng giây)
      type: Number,
      required: true,
      min: 0,
    },
    userAnswers: { // Mảng các câu trả lời của người dùng
      type: [userAnswerSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Thêm createdAt, updatedAt
  }
);

module.exports = mongoose.model('ExamResult', examResultSchema);
