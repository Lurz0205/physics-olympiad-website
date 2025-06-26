// physics-olympiad-website/backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên người dùng, email và mật khẩu.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { name }] });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email này đã được sử dụng bởi tài khoản khác.' });
      }
      if (userExists.name === name) {
        return res.status(400).json({ message: 'Tên người dùng này đã tồn tại. Vui lòng chọn tên khác.' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }, // THAY ĐỔI MỚI: Thêm role
        token,
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return res.status(400).json({ message: `Trường '${field}' với giá trị '${value}' đã tồn tại. Vui lòng chọn giá trị khác.` });
    }
    res.status(500).json({ message: 'Lỗi máy chủ trong quá trình đăng ký.' });
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Email/Tên người dùng và Mật khẩu.' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Tên người dùng/Email hoặc mật khẩu không đúng.' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Tên người dùng/Email hoặc mật khẩu không đúng.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Đăng nhập thành công',
      // THAY ĐỔI MỚI: BỔ SUNG TRƯỜNG 'role' VÀO ĐỐI TƯỢNG USER TRẢ VỀ
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ trong quá trình đăng nhập.' });
  }
};

// @desc    Lấy thông tin người dùng hiện tại (bảo vệ route)
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  getMe,
};
