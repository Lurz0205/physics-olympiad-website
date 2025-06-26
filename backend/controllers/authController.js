// physics-olympiad-website/backend/controllers/authController.js

const User = require('../models/User'); // Đảm bảo đường dẫn đúng tới model User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm đăng ký người dùng mới
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa (email hoặc username)
    let userExists = await User.findOne({ $or: [{ email }, { name }] });
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email đã tồn tại.' });
      }
      if (userExists.name === name) {
        return res.status(400).json({ message: 'Tên người dùng đã tồn tại.' });
      }
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Mặc định là 'user' nếu không có vai trò được cung cấp
    });

    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    console.error('Lỗi khi đăng ký người dùng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi đăng ký.' });
  }
};

// Hàm đăng nhập người dùng
const login = async (req, res) => {
  const { identifier, password } = req.body; // Đổi từ 'email' thành 'identifier'

  try {
    // Tìm người dùng bằng email HOẶC username (name)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Email hoặc tên người dùng không tồn tại.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng.' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token hết hạn sau 1 giờ
    );

    // Trả về thông tin người dùng và token (không bao gồm mật khẩu hash)
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi đăng nhập.' });
  }
};

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => { // THAY ĐỔI: Đổi lại tên hàm từ getUser thành getMe
  try {
    // req.user được gắn bởi middleware protect, chứa thông tin user từ token
    const user = await User.findById(req.user.id).select('-password'); // Lấy user mà không có mật khẩu
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy thông tin người dùng.' });
  }
};

// Export tất cả các hàm
module.exports = {
  register,
  login,
  getMe, // THAY ĐỔI: Export getMe
};
