// physics-olympiad-website/backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  // THAY ĐỔI MỚI: Thêm console.log để kiểm tra dữ liệu nhận được
  console.log('Register request body:', req.body); 

  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên người dùng, email và mật khẩu.' });
    }
    
    // Đảm bảo tên người dùng không phải là chuỗi rỗng sau khi trim
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
      if (userExists.name === name) { // Nếu tên trùng
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
    // Xử lý lỗi trùng lặp key từ MongoDB (ví dụ: name hoặc email unique)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]; // Lấy tên trường bị trùng
        const value = error.keyValue[field]; // Lấy giá trị bị trùng
        // THAY ĐỔI MỚI: Cải thiện thông báo lỗi cho trường hợp trùng lặp
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

// ... (các hàm login và getMe vẫn giữ nguyên) ...

module.exports = {
  register,
  login,
  getMe,
};
