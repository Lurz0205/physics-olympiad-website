// physics-olympiad-website/backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  console.log('Register request body:', req.body);

  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên người dùng, email và mật khẩu.' });
    }
    
    if (name.trim() === '') {
        return res.status(400).json({ message: 'Tên người dùng không được để trống.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    // Kiểm tra tồn tại user dựa trên email HOẶC tên
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
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
        if (field === 'name') {
            return res.status(400).json({ message: `Tên người dùng '${value}' đã tồn tại. Vui lòng chọn tên khác.` });
        } else if (field === 'email') {
            return res.status(400).json({ message: `Email '${value}' đã được sử dụng. Vui lòng chọn email khác.` });
        }
        return res.status(400).json({ message: `Trường '${field}' với giá trị '${value}' đã tồn tại. Vui lòng chọn giá trị khác.` });
    }
    res.status(500).json({ message: 'Lỗi máy chủ trong quá trình đăng ký.' });
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => { // Định nghĩa hàm login
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({
        message: 'Đăng nhập thành công',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ trong quá trình đăng nhập.' });
  }
};

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => { // Định nghĩa hàm getMe
  try {
    const user = await User.findById(req.user.id).select('-password'); // Bỏ trường password
    if (user) {
      res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin người dùng.' });
  }
};

// Export tất cả các hàm sau khi chúng đã được định nghĩa
module.exports = {
  register,
  login,
  getMe,
};
