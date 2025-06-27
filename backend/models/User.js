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
      trim: true, // THAY ĐỔI QUAN TRỌNG: Đảm bảo có trim: true để loại bỏ khoảng trắng ở đầu/cuối
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
  // THÊM LOG: Kiểm tra nếu mật khẩu không bị thay đổi
  if (!this.isModified('password')) { 
    console.log('[User.js - pre save]: Password not modified, skipping hash.');
    return next();
  }
  
  // THÊM LOG: Mật khẩu trước khi hash
  console.log(`[User.js - pre save]: Original password (BEFORE HASHING): '${this.password}'`);

  const salt = await bcrypt.genSalt(10);
  // THÊM LOG: Salt được tạo
  console.log(`[User.js - pre save]: Generated salt: '${salt}'`);

  this.password = await bcrypt.hash(this.password, salt);
  // THÊM LOG: Mật khẩu đã được hash
  console.log(`[User.js - pre save]: Hashed password (AFTER HASHING): '${this.password}'`);
  
  next();
});

// So sánh mật khẩu (phương thức tùy chỉnh)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // THÊM LOG: Mật khẩu người dùng nhập vào
  console.log(`[User.js - matchPassword]: Entered password: '${enteredPassword}'`);
  // THÊM LOG: Mật khẩu đã hash trong DB
  console.log(`[User.js - matchPassword]: Hashed password from DB: '${this.password}'`);
  
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  // THÊM LOG: Kết quả so sánh
  console.log(`[User.js - matchPassword]: bcrypt.compare result: ${isMatch}`);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
