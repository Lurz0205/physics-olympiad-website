// backend/server.js (Hoặc app.js - đây là file khởi chạy chính của backend)
const express = require('express');
const dotenv = require('dotenv').config(); // Để tải biến môi trường từ .env
const colors = require('colors'); // Để làm đẹp console log (đã thêm vào package.json rồi)
const connectDB = require('./config/db'); // Import hàm kết nối database của bạn
const cors = require('cors'); // Middleware để xử lý Cross-Origin Resource Sharing

// Import các file routes
// const userRoutes = require('./routes/userRoutes'); // <--- DÒNG NÀY ĐÃ BỊ XÓA HOẶC COMMENT LẠI
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const practiceRoutes = require('./routes/practice');
const testRoutes = require('./routes/testRoutes');


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
// app.use('/api/users', userRoutes); // <--- DÒNG NÀY ĐÃ BỊ XÓA HOẶC COMMENT LẠI

// Các route hiện có của bạn
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes); 
app.use('/api/practice', practiceRoutes);
app.use('/api/tests', testRoutes);

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
