// physics-olympiad-website/backend/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  // Đặt statusCode: nếu đã có lỗi từ Express (ví dụ: res.status(404)), giữ nguyên; nếu không, mặc định là 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Trả về JSON chứa thông báo lỗi
  res.json({
    message: err.message, // Thông báo lỗi
    // Chỉ hiển thị stack trace (dấu vết lỗi) trong môi trường phát triển (development)
    // Để tránh lộ thông tin nhạy cảm trong môi trường sản phẩm (production)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
