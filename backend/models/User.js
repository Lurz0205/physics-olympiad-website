// physics-olympiad-website/backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên người dùng.'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email.'],
      unique: true,
      lowercase: true,
      match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, 'Vui lòng sử dụng địa chỉ email hợp lệ.'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu.'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự.'],
    },
    // THAY ĐỔI MỚI: Thêm trường 'role'
    role: {
      type: String,
      enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị 'user' hoặc 'admin'
      default: 'user', // Mặc định là 'user'
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
