// physics-olympiad-website/backend/models/Exam.js
const mongoose = require('mongoose');

// Định nghĩa Schema cho một câu hỏi trắc nghiệm
// Đây là một sub-document, sẽ được nhúng trực tiếp vào Exam Schema
const questionSchema = mongoose.Schema({
  questionText: { // Nội dung câu hỏi (hỗ trợ Markdown/LaTeX)
    type: String,
    required: [true, 'Vui lòng thêm nội dung câu hỏi'],
  },
  options: { // Mảng các lựa chọn (hỗ trợ Markdown/LaTeX)
    type: [String],
    required: [true, 'Vui lòng thêm các lựa chọn'],
    validate: {
      validator: function(v) {
        return v && v.length >= 2; // Ít nhất 2 lựa chọn
      },
      message: 'Một câu hỏi phải có ít nhất 2 lựa chọn'
    }
  },
  correctAnswer: { // Đáp án đúng (phải là một trong các options)
    type: String,
    required: [true, 'Vui lòng chọn đáp án đúng'],
    validate: {
      validator: function(v) {
        // Đáp án đúng phải nằm trong danh sách các lựa chọn
        return this.options.includes(v);
      },
      message: 'Đáp án đúng phải là một trong các lựa chọn đã cho'
    }
  },
  explanation: { // Giải thích đáp án (tùy chọn, hỗ trợ Markdown/LaTeX)
    type: String,
    default: '',
  },
});

// Định nghĩa Schema cho một đề thi
const examSchema = mongoose.Schema(
  {
    title: { // Tiêu đề đề thi (ví dụ: Đề thi thử Vật lý Quốc gia 2024)
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề đề thi'],
      trim: true,
    },
    slug: { // Slug duy nhất cho URL thân thiện
      type: String,
      required: [true, 'Vui lòng thêm slug cho đề thi'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { // Mô tả ngắn gọn về đề thi
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    duration: { // Thời gian làm bài tính bằng phút
      type: Number,
      required: [true, 'Vui lòng thêm thời gian làm bài (phút)'],
      min: [1, 'Thời gian làm bài phải lớn hơn 0 phút'],
    },
    category: { // Danh mục đề thi (ví dụ: Tổng hợp, Chuyên đề Cơ học)
      type: String,
      required: [true, 'Vui lòng chọn danh mục cho đề thi'],
      enum: ['TỔNG HỢP', 'CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'],
      default: 'Chưa phân loại',
    },
    questions: { // Mảng các câu hỏi trắc nghiệm được nhúng vào đề thi
      type: [questionSchema], // Sử dụng questionSchema đã định nghĩa
      default: [],
    },
    user: { // Người tạo đề thi (liên kết với User Model)
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Để linh hoạt hơn, có thể set false nếu bạn muốn admin nào cũng tạo được mà không cần gán vào user cụ thể
      ref: 'User',
    },
    isPublished: { // Trạng thái xuất bản
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model('Exam', examSchema);
