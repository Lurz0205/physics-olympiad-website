// physics-olympiad-website/backend/models/Exercise.js
const mongoose = require('mongoose');

// =========================================================
// THAY ĐỔI: Định nghĩa sub-schema cho các loại câu hỏi
// Điều này giúp Exercise có thể chứa câu hỏi trắc nghiệm, đúng/sai, điền số
// =========================================================

const questionTypeSchema = mongoose.Schema({
  questionText: { // Nội dung câu hỏi (cho trắc nghiệm, đúng/sai, điền số)
    type: String,
    required: [true, 'Vui lòng thêm nội dung câu hỏi'],
  },
  options: { // Mảng các lựa chọn (chỉ dùng cho trắc nghiệm, đúng/sai)
    type: [String],
    default: [], // Không bắt buộc nếu là câu hỏi điền số
  },
  correctAnswer: { // Đáp án đúng
    type: String, // Cho trắc nghiệm/đúng sai là option, cho điền số là giá trị
    required: [true, 'Vui lòng chọn/thêm đáp án đúng'],
  },
  explanation: { // Giải thích đáp án (tùy chọn)
    type: String,
    default: '',
  },
});

const exerciseSchema = mongoose.Schema(
  {
    title: { // Tiêu đề bài tập
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề'],
      trim: true,
    },
    slug: { // Slug duy nhất cho URL thân thiện
      type: String,
      required: [true, 'Vui lòng thêm slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { // Mô tả ngắn gọn về bài tập
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    // =========================================================
    // THAY ĐỔI QUAN TRỌNG: Thêm trường 'type' để phân biệt bài tự luận và trắc nghiệm
    // =========================================================
    type: {
      type: String,
      required: [true, 'Vui lòng chọn loại bài tập'],
      enum: ['Tự luận', 'Trắc nghiệm'], // Các loại bài tập
      default: 'Tự luận',
    },
    // Trường này sẽ chứa nội dung đề bài cho cả tự luận và trắc nghiệm
    // Đối với tự luận, nó sẽ là đề bài đầy đủ.
    // Đối với trắc nghiệm, nó sẽ là câu hỏi chính.
    problemStatement: { 
      type: String,
      required: [true, 'Vui lòng thêm đề bài / nội dung câu hỏi'],
    },
    // Trường này sẽ chứa lời giải đầy đủ cho bài tự luận.
    // Đối với trắc nghiệm, phần giải thích cho từng lựa chọn sẽ nằm trong sub-schema `questionTypeSchema`.
    solution: { 
      type: String,
      default: '',
    },
    // =========================================================
    // THAY ĐỔI: Thêm trường 'questions' để lưu các câu hỏi trắc nghiệm nếu type là 'Trắc nghiệm'
    // =========================================================
    questions: {
      type: [questionTypeSchema], // Mảng các câu hỏi con nếu là loại Trắc nghiệm
      default: [],
    },
    category: { // Danh mục bài tập (ví dụ: Cơ học, Nhiệt học)
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'],
      default: 'Chưa phân loại',
    },
    difficulty: { // Độ khó của bài tập
      type: String,
      required: [true, 'Vui lòng chọn độ khó'],
      enum: ['Dễ', 'Trung bình', 'Khó', 'Rất khó'],
      default: 'Trung bình',
    },
    tags: { // Các thẻ/keywords liên quan (dùng để tìm kiếm)
      type: [String],
      default: [],
    },
    user: { // Người tạo bài tập (liên kết với User Model)
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
