// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token hết hạn sau 30 ngày
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // THÊM LOG: Dữ liệu nhận được từ request body khi đăng ký
  console.log(`[authController - registerUser]: Received data - Name: '${name}', Email: '${email}', Password: '${password}'`);

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Vui lòng thêm tất cả các trường.');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Người dùng đã tồn tại.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Mật khẩu sẽ được hash bởi middleware pre('save') trong User model
  });

  if (user) {
    // THÊM LOG: Người dùng đã được tạo thành công
    console.log(`[authController - registerUser]: User created: ID: ${user.id}, Email: '${user.email}'`);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ.');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // THÊM LOG: Dữ liệu nhận được từ request body khi đăng nhập
  console.log(`[authController - loginUser]: Received data - Email: '${email}', Password: '${password}'`);

  // Check for user email
  const user = await User.findOne({ email }); // Sử dụng .select('+password') nếu bạn dùng select: false trong model để ẩn password

  // THÊM LOG: Người dùng tìm được từ DB
  if (user) {
    console.log(`[authController - loginUser]: User found in DB for email '${email}'. User ID: ${user.id}`);
  } else {
    console.log(`[authController - loginUser]: No user found for email '${email}'.`);
  }

  if (user && (await user.matchPassword(password))) {
    // THÊM LOG: Đăng nhập thành công
    console.log(`[authController - loginUser]: Login successful for user: ${user.email}`);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    // THÊM LOG: Đăng nhập thất bại
    console.log(`[authController - loginUser]: Login failed for email '${email}'. (Password mismatch or user not found)`);
    res.status(400); // 400 Bad Request cho lỗi đăng nhập
    throw new Error('Email hoặc mật khẩu không đúng.'); // Thông báo chung để bảo mật
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user được thiết lập bởi middleware bảo vệ (protect)
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
