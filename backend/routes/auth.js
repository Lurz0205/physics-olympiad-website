// physics-olympiad-website/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
  }

  // Username length validation
  if (username.length < 8) {
    return res.status(400).json({ message: 'Tên đăng nhập phải có ít nhất 8 ký tự.' });
  }

  // Password length validation
  if (password.length < 8) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự.' });
  }

  // Password complexity validation: at least 1 letter and 1 number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất một chữ cái và một số.' });
  }

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }

    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          _id: user._id,
          username: user.username,
        },
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: 'Đăng nhập thành công',
        user: {
          _id: user._id,
          username: user.username,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

module.exports = router;
