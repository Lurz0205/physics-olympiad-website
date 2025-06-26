// physics-olympiad-website/backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs để mã hóa mật khẩu

const userSchema = mongoose.Schema(
  {
    name: { // Tên người dùng, sẽ được dùng để đăng nhập và phải là duy nhất
      type: String,
      required: [true, 'Vui lòng nhập tên người dùng.'], // Thông báo lỗi rõ ràng hơn
      unique: true, // RẤT QUAN TRỌNG: Đảm bảo tên người dùng là duy nhất
      trim: true, // Loại bỏ khoảng trắng ở đầu/cuối
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email.'], // Thông báo lỗi rõ ràng hơn
      unique: true, // RẤT QUAN TRỌNG: Đảm bảo email là duy nhất
      lowercase: true, // Chuyển email về chữ thường
      match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, 'Vui lòng sử dụng địa chỉ email hợp lệ.'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu.'], // Thông báo lỗi rõ ràng hơn
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự.'], // Thêm kiểm tra độ dài mật khẩu
    },
    // Bạn có thể thêm các trường khác ở đây nếu cần, ví dụ: role, avatar, ...
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware để mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Phương thức để so sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
