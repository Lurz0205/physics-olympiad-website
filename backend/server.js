// backend/server.js (Hoặc app.js - đây là file khởi chạy chính của backend)
const express = require('express');
const dotenv = require('dotenv').config(); // Để tải biến môi trường từ .env
const colors = require('colors'); // Để làm đẹp console log (tùy chọn)
const connectDB = require('./config/db'); // Import hàm kết nối database của bạn
const cors = require('cors'); // Middleware để xử lý Cross-Origin Resource Sharing

// Import các file routes
const userRoutes = require('./routes/userRoutes'); // Giả sử bạn có userRoutes
const theoryRoutes = require('./routes/theory'); // <--- ĐÂY LÀ ĐIỀU QUAN TRỌNG: Import theoryRoutes

const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB(); // Gọi hàm kết nối database của bạn

// Middlewares
// Cho phép các yêu cầu từ các origin khác (quan trọng cho frontend/backend tách biệt)
app.use(cors());

// Cho phép Express phân tích cú pháp JSON bodies từ request
app.use(express.json());

// Cho phép Express phân tích cú pháp URL-encoded bodies từ request
app.use(express.urlencoded({ extended: false }));

// Định nghĩa các Route API
// Sử dụng userRoutes cho các endpoint bắt đầu bằng '/api/users'
app.use('/api/users', userRoutes);

// <--- ĐÂY LÀ ĐIỀU QUAN TRỌNG:
// Sử dụng theoryRoutes cho các endpoint bắt đầu bằng '/api/theory'
app.use('/api/theory', theoryRoutes); 

// Route mặc định cho kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware xử lý lỗi (nếu bạn có)
// const { errorHandler } = require('./middleware/errorMiddleware'); // Nếu bạn có custom error handler
// app.use(errorHandler); // Sử dụng custom error handler

// Cổng mà server sẽ lắng nghe
const PORT = process.env.PORT || 5000;

// Khởi chạy server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.cyan.bold));
