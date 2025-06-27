// physics-olympiad-website/backend/models/Exam.js
const mongoose = require('mongoose');

// Định nghĩa Schema cho các ý trong câu hỏi Đúng/Sai
const statementSchema = mongoose.Schema({
  statementText: { // Nội dung của ý (ví dụ: "Dòng điện là chuyển động có hướng của các hạt mang điện.")
    type: String,
    required: [true, 'Vui lòng thêm nội dung cho ý.'],
    trim: true,
  },
  isCorrect: { // Đáp án: true cho Đúng, false cho Sai
    type: Boolean,
    required: [true, 'Vui lòng chọn đáp án Đúng/Sai cho ý.'],
  },
}, { _id: false }); // Không cần _id riêng cho mỗi ý nếu chúng luôn đi kèm câu hỏi cha

// Định nghĩa Schema chung cho mọi loại câu hỏi
const questionSchema = mongoose.Schema({
  // Loại câu hỏi (bắt buộc)
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: [true, 'Vui lòng chọn loại câu hỏi.'],
  },
  // Nội dung chính của câu hỏi (chung cho tất cả các loại)
  questionText: { // Nội dung câu hỏi (hỗ trợ Markdown/LaTeX)
    type: String,
    required: [true, 'Vui lòng thêm nội dung câu hỏi.'],
    trim: true,
  },
  // =========================================================
  // Các trường đặc trưng cho loại 'multiple-choice'
  options: { // Mảng các lựa chọn (hỗ trợ Markdown/LaTeX)
    type: [String],
    required: function() { return this.type === 'multiple-choice'; }, // Bắt buộc nếu là trắc nghiệm
    validate: {
      validator: function(v) {
        if (this.type === 'multiple-choice') {
          // Ít nhất 2 lựa chọn không rỗng
          return v && v.filter(opt => opt.trim() !== '').length >= 2;
        }
        return true; // Không áp dụng validation này cho các loại khác
      },
      message: 'Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn đã điền.'
    }
  },
  multipleChoiceCorrectAnswer: { // Đáp án đúng cho trắc nghiệm (phải là một trong các options)
    type: String,
    required: function() { return this.type === 'multiple-choice'; }, // Bắt buộc nếu là trắc nghiệm
    validate: {
      validator: function(v) {
        if (this.type === 'multiple-choice' && this.options) {
          // Đáp án đúng phải nằm trong danh sách các lựa chọn đã điền (không phân biệt hoa/thường, trim)
          return this.options.map(opt => opt.toLowerCase().trim()).includes(v.toLowerCase().trim());
        }
        return true; // Không áp dụng validation này cho các loại khác
      },
      message: 'Đáp án đúng phải là một trong các lựa chọn đã cho.'
    }
  },
  // =========================================================
  // Các trường đặc trưng cho loại 'true-false'
  statements: { // Mảng 4 ý của câu hỏi Đúng/Sai
    type: [statementSchema],
    required: function() { return this.type === 'true-false'; }, // Bắt buộc nếu là Đúng/Sai
    validate: {
      validator: function(v) {
        if (this.type === 'true-false') {
          // Phải có đúng 4 ý và mỗi ý phải có statementText
          return v && v.length === 4 && v.every(s => s.statementText && s.statementText.trim() !== '');
        }
        return true; // Không áp dụng validation này cho các loại khác
      },
      message: 'Câu hỏi Đúng/Sai phải có đúng 4 ý và mỗi ý phải có nội dung.'
    }
  },
  // =========================================================
  // Các trường đặc trưng cho loại 'short-answer'
  shortAnswerCorrectAnswer: { // Đáp án đúng cho trả lời ngắn
    type: String,
    required: function() { return this.type === 'short-answer'; }, // Bắt buộc nếu là trả lời ngắn
    trim: true,
    validate: {
      validator: function(v) {
        if (this.type === 'short-answer') {
          // Tối đa 4 ký tự, chỉ chứa số (0-9), dấu "-" và dấu ","
          return v && v.length <= 4 && /^[0-9,-]*$/.test(v);
        }
        return true; // Không áp dụng validation này cho các loại khác
      },
      message: 'Đáp án trả lời ngắn phải có tối đa 4 ký tự và chỉ chứa số (0-9), dấu "-" và dấu ",".'
    }
  },
  // =========================================================
  explanation: { // Giải thích đáp án (tùy chọn, hỗ trợ Markdown/LaTeX) - Chung cho tất cả
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
      unique: true, // Đảm bảo slug là duy nhất
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
    questions: { // Mảng các câu hỏi được nhúng vào đề thi (có thể là nhiều loại)
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
