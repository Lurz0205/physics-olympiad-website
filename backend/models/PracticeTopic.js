// physics-olympiad-website/backend/models/PracticeTopic.js
const mongoose = require('mongoose');

const practiceTopicSchema = mongoose.Schema(
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
    category: { // Giống như Theory, để nhóm các chủ đề bài tập
      type: String,
      required: [true, 'Vui lòng chọn một danh mục cho chủ đề bài tập.'],
      enum: ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI'],
      default: 'Chưa phân loại',
    },
  },
  {
    timestamps: true,
  }
);

const PracticeTopic = mongoose.model('PracticeTopic', practiceTopicSchema);

module.exports = PracticeTopic;
