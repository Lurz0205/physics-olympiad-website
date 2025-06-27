// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Để hash mật khẩu

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng thêm tên người dùng'],
      unique: true, // Đảm bảo tên người dùng là duy nhất
      trim: true,
      minlength: [3, 'Tên người dùng phải dài ít nhất 3 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng thêm email'],
      unique: true, // Đảm bảo email là duy nhất
      trim: true,
      lowercase: true, // Lưu email dưới dạng chữ thường để tránh trùng lặp do case sensitivity
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập địa chỉ email hợp lệ'], // Validate định dạng email
    },
    password: {
      type: String,
      required: [true, 'Vui lòng thêm mật khẩu'],
      trim: true, // Giữ trim ở đây để loại bỏ khoảng trắng ở đầu/cuối trước khi hash/validate
      minlength: [8, 'Mật khẩu phải dài ít nhất 8 ký tự'],
      // THAY ĐỔI MỚI: Sử dụng custom validator để kiểm tra nội dung mật khẩu
      validate: {
        validator: function(v) {
          // Mật khẩu không chứa dấu cách bên trong
          if (v.includes(' ')) {
            return false;
          }
          // Mật khẩu phải chứa ít nhất một chữ cái HOẶC một số
          // Regex /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(v) là KHÔNG ĐÚNG vì nó yêu cầu CẢ chữ và số
          // Yêu cầu là "ít nhất chữ HOẶC số", tức là (chữ) HOẶC (số)
          return /[a-zA-Z]/.test(v) || /[0-9]/.test(v); 
        },
        message: 'Mật khẩu phải chứa ít nhất một chữ cái hoặc một số và không chứa dấu cách.'
      },
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
  // enteredPassword sẽ được trim ở controller trước khi gọi hàm này
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
