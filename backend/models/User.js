// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Để hash mật khẩu

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng thêm tên người dùng'],
      unique: true, // THAY ĐỔI MỚI: Đảm bảo tên người dùng là duy nhất
      trim: true,
      minlength: [3, 'Tên người dùng phải dài ít nhất 3 ký tự'], // Thêm validate minlength cho username
    },
    email: {
      type: String,
      required: [true, 'Vui lòng thêm email'],
      unique: true, // Đảm bảo email là duy nhất
      trim: true,
      lowercase: true, // Lưu email dưới dạng chữ thường để tránh trùng lặp do case sensitivity
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập địa chỉ email hợp lệ'], // Thêm validate định dạng email
    },
    password: {
      type: String,
      required: [true, 'Vui lòng thêm mật khẩu'],
      trim: false, // Giữ trim là false ở đây vì regex sẽ kiểm tra dấu cách nội bộ
      minlength: [8, 'Mật khẩu phải dài ít nhất 8 ký tự'], // THAY ĐỔI MỚI: Mật khẩu tối thiểu 8 ký tự
      // THAY ĐỔI MỚI: Regex kiểm tra mật khẩu:
      // - (?=.*[a-zA-Z]): Chứa ít nhất một chữ cái (hoa hoặc thường)
      // - (?=.*[0-9]): Chứa ít nhất một số
      // - (?!.*\s): KHÔNG chứa bất kỳ khoảng trắng nào
      match: [/^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*\s).{8,}$/, 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ cái, số và không chứa dấu cách'], 
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
  if (!this.isModified('password')) { 
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu (phương thức tùy chỉnh)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // `enteredPassword` đã được trim ở controller nếu có dấu cách
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
