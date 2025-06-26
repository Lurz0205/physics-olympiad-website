// physics-olympiad-website/backend/models/Theory.js
const mongoose = require('mongoose');

const theorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Đảm bảo title là duy nhất
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Đảm bảo slug là duy nhất
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // THAY ĐỔI MỚI: Thêm trường category
    category: {
      type: String,
      required: [true, 'Vui lòng chọn một danh mục cho bài lý thuyết.'],
      // Định nghĩa các danh mục có sẵn
      enum: ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI'], // Thêm các category bạn muốn
      default: 'Chưa phân loại', // Giá trị mặc định nếu không được cung cấp
    },
    // Các trường khác như references, level, ... có thể thêm sau
  },
  {
    timestamps: true,
  }
);

const Theory = mongoose.model('Theory', theorySchema);

module.exports = Theory;
