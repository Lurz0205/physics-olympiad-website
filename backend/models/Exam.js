// physics-olympiad-website/backend/models/Exam.js
const mongoose = require('mongoose');

// Define Schema for statements in True/False questions
const statementSchema = mongoose.Schema({
  statementText: { // Content of the statement (e.g., "Electric current is the directed motion of charged particles.")
    type: String,
    required: [true, 'Vui lòng thêm nội dung cho ý.'],
    trim: true,
  },
  isCorrect: { // Answer: true for True, false for False
    type: Boolean,
    required: [true, 'Vui lòng chọn đáp án Đúng/Sai cho ý.'],
  },
}, { _id: false }); // No separate _id needed for each statement if they are always part of a parent question

// Define common Schema for all question types
const questionSchema = mongoose.Schema({
  // Question type (required)
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: [true, 'Vui lòng chọn loại câu hỏi.'],
  },
  // Main content of the question (common for all types)
  questionText: { // Question content (supports Markdown/LaTeX)
    type: String,
    required: [true, 'Vui lòng thêm nội dung câu hỏi.'],
    trim: true,
  },
  // =========================================================
  // Fields specific to 'multiple-choice' type
  options: { // Array of options (supports Markdown/LaTeX)
    type: [String],
    required: function() { return this.type === 'multiple-choice'; }, // Required if it's multiple-choice
    validate: {
      validator: function(v) {
        if (this.type === 'multiple-choice') {
          // At least 2 non-empty options
          return v && v.filter(opt => opt.trim() !== '').length >= 2;
        }
        return true; // This validation does not apply to other types
      },
      message: 'Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn đã điền.'
    }
  },
  multipleChoiceCorrectAnswer: { // Correct answer for multiple-choice (must be one of the options)
    type: String,
    required: function() { return this.type === 'multiple-choice'; }, // Required if it's multiple-choice
    validate: {
      validator: function(v) {
        if (this.type === 'multiple-choice' && this.options) {
          // Correct answer must be among the filled options (case-insensitive, trimmed)
          return this.options.map(opt => opt.toLowerCase().trim()).includes(v.toLowerCase().trim());
        }
        return true; // This validation does not apply to other types
      },
      message: 'Đáp án đúng phải là một trong các lựa chọn đã cho.'
    }
  },
  // =========================================================
  // Fields specific to 'true-false' type
  statements: { // Array of 4 statements for True/False questions
    type: [statementSchema],
    required: function() { return this.type === 'true-false'; }, // Required if it's True/False
    validate: {
      validator: function(v) {
        if (this.type === 'true-false') {
          // Must have exactly 4 statements and each statement must have text
          return v && v.length === 4 && v.every(s => s.statementText && s.statementText.trim() !== '');
        }
        return true; // This validation does not apply to other types
      },
      message: 'Câu hỏi Đúng/Sai phải có đúng 4 ý và mỗi ý phải có nội dung.'
    }
  },
  // =========================================================
  // Fields specific to 'short-answer' type
  shortAnswerCorrectAnswer: { // Correct answer for short answer
    type: String,
    required: function() { return this.type === 'short-answer'; }, // Required if it's short answer
    trim: true,
    validate: {
      validator: function(v) {
        if (this.type === 'short-answer') {
          // Max 4 characters, only digits (0-9), dash "-", and comma ","
          return v && v.length <= 4 && /^[0-9,-]*$/.test(v);
        }
        return true; // This validation does not apply to other types
      },
      message: 'Đáp án trả lời ngắn phải có tối đa 4 ký tự và chỉ chứa số (0-9), dấu "-" và dấu ",".'
    }
  },
  // =========================================================
  explanation: { // Explanation for the answer (optional, supports Markdown/LaTeX) - Common to all
    type: String,
    default: '',
  },
});

// Define Schema for an exam
const examSchema = mongoose.Schema(
  {
    title: { // Exam title (e.g., National Physics Mock Exam 2024)
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề đề thi'],
      trim: true,
    },
    slug: { // Unique slug for friendly URL
      type: String,
      required: [true, 'Vui lòng thêm slug cho đề thi'],
      unique: true, // Ensure slug is unique
      trim: true,
      lowercase: true,
    },
    description: { // Short description of the exam
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    duration: { // Exam duration in minutes
      type: Number,
      required: [true, 'Vui lòng thêm thời gian làm bài (phút)'],
      min: [1, 'Thời gian làm bài phải lớn hơn 0 phút'],
    },
    category: { // Exam category (e.g., General, Mechanics, etc.)
      type: String,
      required: [true, 'Vui lòng chọn danh mục cho đề thi'],
      enum: ['TỔNG HỢP', 'CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'],
      default: 'Chưa phân loại',
    },
    questions: { // Array of questions embedded in the exam (can be multiple types)
      type: [questionSchema], // Use the defined questionSchema
      default: [],
    },
    user: { // User who created the exam (links to User Model)
      type: mongoose.Schema.Types.ObjectId,
      required: false, // For more flexibility, can set to false if any admin can create without linking to a specific user
      ref: 'User',
    },
    isPublished: { // Publication status
      type: Boolean,
      default: false,
    },
    // ============ ADD NEW SCORING CONFIGURATION HERE ============
    scoringConfig: {
      type: Object, // Use Object to store flexible scoring configuration
      default: {
        multipleChoice: 1, // Default points for each multiple-choice question
        shortAnswer: 1,    // Default points for each short-answer question
        trueFalse: {       // Scoring configuration by number of correct statements for True/False (total 4 statements)
          '1': 0.25,       // Points if 1 statement is correct
          '2': 0.5,        // Points if 2 statements are correct
          '3': 0.75,       // Points if 3 statements are correct
          '4': 1           // Points if 4 statements are correct (Maximum points for a True/False question)
        }
      },
      // If you want this configuration to be required, you can add required: true
      // However, with a default, it's not strictly necessary when creating new exams
    }
    // =========================================================
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model('Exam', examSchema);
