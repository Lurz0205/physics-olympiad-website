// physics-olympiad-website/backend/middleware/adminAuthMiddleware.js
const adminProtect = (req, res, next) => {
  // `req.user` được thiết lập bởi `authMiddleware.js` nếu người dùng đã đăng nhập và token hợp lệ
  if (req.user && req.user.role === 'admin') {
    next(); // Người dùng là admin, cho phép tiếp tục
  } else {
    // Không phải admin hoặc chưa đăng nhập
    res.status(403).json({ message: 'Không có quyền truy cập. Chỉ quản trị viên mới được phép thực hiện thao tác này.' });
  }
};

module.exports = adminProtect;
