// physics-olympiad-website/backend/models/Test.js
const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: { // Dùng cho URL thân thiện
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: { // Thời lượng làm bài bằng phút
      type: Number,
      required: true,
    },
    questions: [ // Mảng chứa các câu hỏi của đề thi
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        explanation: { type: String }, // Giải thích cho đáp án
        // Bạn có thể thêm type: String cho loại câu hỏi (trắc nghiệm, tự luận) nếu cần
      },
    ],
    createdBy: { // User tạo đề thi (nếu có hệ thống admin)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Giả định có User model
      required: true,
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt
  }
);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
