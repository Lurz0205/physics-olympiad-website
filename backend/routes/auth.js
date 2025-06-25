const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hàm tạo token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token hết hạn sau 1 giờ
  });
};

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
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
// @desc    Đăng nhập người dùng
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
