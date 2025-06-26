// physics-olympiad-website/backend/models/Test.js
const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: { // Thời lượng đề thi tính bằng phút
      type: Number,
      required: true,
      min: 1,
    },
    category: { // Tương tự như Theory và PracticeTopic
      type: String,
      required: [true, 'Vui lòng chọn một danh mục cho đề thi.'],
      enum: ['ĐỀ THI HSG TỈNH', 'ĐỀ THI HSG QUỐC GIA', 'ĐỀ THI THỬ', 'ĐỀ THI CÁC TRƯỜNG'],
      default: 'ĐỀ THI THỬ',
    },
    // exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamResult' }] // Nếu muốn lưu kết quả thi của users
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
