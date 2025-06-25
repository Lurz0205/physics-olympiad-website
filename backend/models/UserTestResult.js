const mongoose = require('mongoose');

const UserTestResultSchema = new mongoose.Schema({
  user: { // Liên kết với người dùng đã làm bài
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testId: { // Tên của đề thi đã làm
    type: String,
    required: true,
  },
  score: { // Điểm số đạt được
    type: Number,
    required: true,
    min: 0,
  },
  totalQuestions: { // Tổng số câu hỏi trong đề
    type: Number,
    required: true,
    min: 0,
  },
  timeTakenSeconds: { // Thời gian làm bài (tính bằng giây)
    type: Number,
    required: false, // Có thể không bắt buộc nếu test không có timer
    min: 0,
  },
  submittedAt: { // Thời điểm nộp bài
    type: Date,
    default: Date.now,
  },
});

UserTestResultSchema.index({ user: 1, testId: 1 }, { unique: false });

module.exports = mongoose.model('UserTestResult', UserTestResultSchema);
