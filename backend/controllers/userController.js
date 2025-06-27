// physics-olympiad-website/backend/controllers/userController.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // Import asyncHandler

// @desc    Lấy tất cả người dùng (chỉ Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => { // Bọc bằng asyncHandler
  const users = await User.find({}).select('-password'); // Không trả về mật khẩu
  res.json(users);
});

// @desc    Lấy một người dùng theo ID (chỉ Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => { // Bọc bằng asyncHandler
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng.'); // Ném lỗi để asyncHandler bắt
  }
});

// @desc    Cập nhật thông tin người dùng (chỉ Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => { // Bọc bằng asyncHandler
  const { name, email, role } = req.body;

  // Tìm người dùng cần cập nhật
  const user = await User.findById(req.params.id);

  if (user) {
    // THAY ĐỔI MỚI: Ngăn admin tự hạ cấp vai trò của chính mình
    // Nếu người dùng đang cố gắng cập nhật vai trò của chính họ và thay đổi nó thành không phải 'admin'
    if (req.user && req.user._id.toString() === user._id.toString() && role && role !== 'admin') {
      res.status(403);
      throw new Error('Bạn không thể hạ cấp vai trò của chính mình.');
    }

    // Áp dụng trim cho name và email
    user.name = name ? name.trim() : user.name;
    user.email = email ? email.trim() : user.email;
    user.role = role || user.role; // Cho phép admin cập nhật vai trò

    const updatedUser = await user.save(); // save() sẽ kích hoạt pre('save') middleware (hashing nếu password thay đổi) và validation

    res.json({
      _id: updatedUser._id, // Đổi id thành _id để thống nhất
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng.');
  }
});

// @desc    Xóa người dùng (chỉ Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => { // Bọc bằng asyncHandler
  const user = await User.findById(req.params.id);

  if (user) {
    // THAY ĐỔI MỚI: Ngăn không cho admin tự xóa tài khoản của chính mình
    if (req.user && req.user._id.toString() === user._id.toString()) {
      res.status(400); // 400 Bad Request vì đây là lỗi logic từ request
      throw new Error('Bạn không thể xóa tài khoản của chính mình.');
    }
    await user.deleteOne();
    res.json({ message: 'Người dùng đã được xóa.' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng.');
  }
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
