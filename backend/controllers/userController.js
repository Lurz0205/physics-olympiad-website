// physics-olympiad-website/backend/controllers/userController.js
const User = require('../models/User');

// @desc    Lấy tất cả người dùng (chỉ Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Không trả về mật khẩu
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách người dùng.' });
  }
};

// @desc    Lấy một người dùng theo ID (chỉ Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin người dùng.' });
  }
};

// @desc    Cập nhật thông tin người dùng (chỉ Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role; // Cho phép admin cập nhật vai trò

      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
  } catch (error) {
    console.error(error);
    // Xử lý lỗi trùng lặp email/name nếu có
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return res.status(400).json({ message: `Trường '${field}' với giá trị '${value}' đã tồn tại.` });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật người dùng.' });
  }
};

// @desc    Xóa người dùng (chỉ Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Ngăn không cho admin tự xóa tài khoản của chính mình (tùy chọn)
      // if (user._id.toString() === req.user.id.toString()) {
      //   return res.status(400).json({ message: 'Bạn không thể xóa tài khoản của chính mình.' });
      // }
      await user.deleteOne();
      res.json({ message: 'Người dùng đã được xóa.' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa người dùng.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
