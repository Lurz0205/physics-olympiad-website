// physics-olympiad-website/backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Đảm bảo đường dẫn đúng đến User model của bạn

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra xem tất cả các trường cần thiết có được cung cấp không (kiểm tra cơ bản)
    if (!name || !email || !password) {
      // Thông báo lỗi này sẽ trùng với thông báo frontend nếu thiếu trường
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên người dùng, email và mật khẩu.' });
    }

    // Kiểm tra độ dài mật khẩu ở backend (thêm một lớp bảo vệ)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    // Kiểm tra xem người dùng đã tồn tại bằng email hoặc tên người dùng chưa
    const userExists = await User.findOne({ $or: [{ email }, { name }] });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email này đã được sử dụng bởi tài khoản khác.' });
      }
      if (userExists.name === name) {
        return res.status(400).json({ message: 'Tên người dùng này đã tồn tại. Vui lòng chọn tên khác.' });
      }
    }

    // Tạo người dùng mới (mật khẩu sẽ được mã hóa bởi pre-save hook trong User model)
    const user = await User.create({
      name,
      email,
      password, // Password sẽ tự động được mã hóa trước khi lưu
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    // Đây có thể là lỗi từ MongoDB nếu unique: true bị vi phạm mà không được bắt ở trên
    if (error.code === 11000) { // Mã lỗi 11000 là lỗi trùng lặp key (unique index)
        return res.status(400).json({ message: 'Email hoặc tên người dùng đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ trong quá trình đăng ký.' });
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' có thể là email hoặc tên người dùng

  try {
    // Tìm người dùng bằng email hoặc tên người dùng
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    });

    if (!user) {
      // Thông báo lỗi chung để tránh tiết lộ thông tin tài khoản
      return res.status(400).json({ message: 'Tên người dùng/Email hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await user.matchPassword(password); // Sử dụng phương thức matchPassword từ User model

    if (!isMatch) {
      return res.status(400).json({ message: 'Tên người dùng/Email hoặc mật khẩu không đúng.' });
    }

    // Nếu đăng nhập thành công, tạo JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Đăng nhập thành công',
      user: { id: user._id, name: user.name, email: user.email },
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
  // req.user được thiết lập bởi middleware bảo vệ
  res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  getMe,
};
