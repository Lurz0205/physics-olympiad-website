// physics-olympiad-website/backend/models/TestQuestion.js
const mongoose = require('mongoose');

const testQuestionSchema = mongoose.Schema(
  {
    test: { // Liên kết với Test
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    questionText: { // Nội dung câu hỏi
      type: String,
      required: true,
    },
    options: { // Mảng các lựa chọn đáp án
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length >= 2; // Ít nhất 2 lựa chọn
        },
        message: 'Mỗi câu hỏi phải có ít nhất 2 lựa chọn.'
      }
    },
    correctAnswer: { // Đáp án đúng
      type: String,
      required: true,
    },
    explanation: { // Giải thích đáp án
      type: String,
    },
    // difficulty: { // Độ khó có thể thêm vào nếu cần
    //   type: String,
    //   enum: ['Dễ', 'Trung bình', 'Khó'],
    //   default: 'Trung bình',
    // },
  },
  {
    timestamps: true,
  }
);

const TestQuestion = mongoose.model('TestQuestion', testQuestionSchema);

module.exports = TestQuestion;
