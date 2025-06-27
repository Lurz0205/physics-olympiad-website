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

  // Trim name, email, và password ngay từ đầu (password cũng sẽ được trim bởi model)
  const trimmedName = name ? name.trim() : '';
  const trimmedEmail = email ? email.trim() : '';
  const trimmedPassword = password ? password.trim() : ''; // Quan trọng: trim password input

  // Basic validation
  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    res.status(400);
    throw new Error('Vui lòng thêm tất cả các trường.');
  }

  // Kiểm tra mật khẩu có dấu cách bên trong không (trước khi tạo user để bắt lỗi sớm)
  // Mongoose schema validator cũng sẽ kiểm tra, nhưng đây là một kiểm tra nhanh ở controller.
  if (trimmedPassword.includes(' ')) {
    res.status(400);
    throw new Error('Mật khẩu không được chứa dấu cách.');
  }

  // Check if user with this email or name already exists
  const userExists = await User.findOne({ $or: [{ email: trimmedEmail }, { name: trimmedName }] }); 
  if (userExists) {
    res.status(400);
    if (userExists.email === trimmedEmail) {
      throw new Error('Email đã tồn tại.');
    } else {
      throw new Error('Tên người dùng đã tồn tại.');
    }
  }

  try {
    // Create user (password sẽ được hash và validate bởi middleware pre('save') và schema trong User model)
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword, // Dùng mật khẩu đã trim
    });

    if (user) {
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
  } catch (error) {
    // Xử lý lỗi validation từ Mongoose schema
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400);
      throw new Error(messages.join(', '));
    }
    throw error; // Ném lỗi khác nếu không phải validation error
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body; 

  // Trim identifier và password đầu vào
  const trimmedIdentifier = identifier ? identifier.trim() : '';
  const trimmedPassword = password ? password.trim() : '';

  // Tìm người dùng bằng email HOẶC username
  const user = await User.findOne({
    $or: [
      { email: trimmedIdentifier },
      { name: trimmedIdentifier }
    ]
  });

  if (user && (await user.matchPassword(trimmedPassword))) { 
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400); 
    throw new Error('Email/Tên người dùng hoặc mật khẩu không đúng.'); 
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
