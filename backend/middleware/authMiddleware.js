// physics-olympiad-website/backend/middleware/authMiddleware.js
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
      req.user = await User.findById(decoded.id).select('-password'); // Bỏ qua trường password
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không được ủy quyền, token lỗi' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không được ủy quyền, không có token' });
  }
};

// Export trực tiếp hàm protect
module.exports = protect;
