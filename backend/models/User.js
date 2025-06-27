// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Để hash mật khẩu

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng thêm tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng thêm email'],
      unique: true, // Đảm bảo email là duy nhất
      trim: true,
      lowercase: true, // Lưu email dưới dạng chữ thường để tránh trùng lặp do case sensitivity
    },
    password: {
      type: String,
      required: [true, 'Vui lòng thêm mật khẩu'],
      trim: true, // THAY ĐỔI MỚI QUAN TRỌNG: Tự động loại bỏ khoảng trắng ở đầu/cuối
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Vai trò người dùng
      default: 'user',
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Mã hóa mật khẩu trước khi lưu (middleware Mongoose)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Chỉ mã hóa nếu mật khẩu được thay đổi (hoặc mới tạo)
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu (phương thức tùy chỉnh)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
