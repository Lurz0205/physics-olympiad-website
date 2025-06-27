// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user theo ID trong token và gán vào req.user
      // .select('-password') sẽ trả về tất cả các trường trừ password
      req.user = await User.findById(decoded.id).select('-password'); 

      // THÊM LOG MỚI QUAN TRỌNG: Kiểm tra thông tin người dùng được gán vào req.user
      if (req.user) {
        console.log(`[authMiddleware]: User ID: ${req.user._id}, Role: '${req.user.role}', Email: '${req.user.email}'`);
      } else {
        console.log(`[authMiddleware]: User not found for decoded ID: ${decoded.id}`);
      }

      next();
    } catch (error) {
      console.error(`[authMiddleware]: Token verification error: ${error.message}`);
      res.status(401).json({ message: 'Không được ủy quyền, token lỗi' });
    }
  } else { // THAY ĐỔI: Chuyển kiểm tra !token ra ngoài if chính
    console.log('[authMiddleware]: No token provided in headers.');
    res.status(401).json({ message: 'Không được ủy quyền, không có token' });
  }
};

// Export trực tiếp hàm protect
module.exports = protect;
