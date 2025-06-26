// physics-olympiad-website/backend/models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema(
  {
    title: { // Tiêu đề bài tập
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: { // Slug duy nhất cho URL thân thiện
      type: String,
      required: [true, 'Please add a slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { // Mô tả ngắn gọn về bài tập
      type: String,
      // THAY ĐỔI: Chỉnh required thành false để mô tả không bắt buộc
      required: false, 
      trim: true,
      default: '', // Đặt giá trị mặc định là chuỗi rỗng nếu không có
    },
    problemStatement: { // Nội dung đề bài (có thể chứa Markdown/LaTeX)
      type: String,
      required: [true, 'Please add the problem statement'],
    },
    solution: { // Lời giải chi tiết (có thể chứa Markdown/LaTeX)
      type: String,
      default: '', // Có thể để trống nếu chưa có lời giải
    },
    category: { // Danh mục bài tập (ví dụ: Cơ học, Nhiệt học)
      type: String,
      required: [true, 'Please select a category'],
      enum: ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'],
      default: 'Chưa phân loại',
    },
    difficulty: { // Độ khó của bài tập
      type: String,
      required: [true, 'Please select a difficulty level'],
      enum: ['Dễ', 'Trung bình', 'Khó', 'Rất khó'],
      default: 'Trung bình',
    },
    tags: { // Các thẻ/keywords liên quan (dùng để tìm kiếm)
      type: [String], // Mảng các chuỗi
      default: [],
    },
    user: { // Người tạo bài tập (liên kết với User Model) - nếu muốn lưu người đã tạo
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Có thể không bắt buộc nếu bạn không muốn lưu người tạo
      ref: 'User',
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
