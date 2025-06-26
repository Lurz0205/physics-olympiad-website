// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors'); // For colored console output
const cors = require('cors'); // Import cors middleware
const connectDB = require('./config/db'); // Database connection
const { errorHandler } = require('./middleware/errorMiddleware'); // Custom error handler

// Import routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const exerciseRoutes = require('./routes/exercise');

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// =========================================================
// THAY ĐỔI QUAN TRỌNG: CẤU HÌNH CORS
// Đảm bảo phần này được đặt NGAY SAU khi khởi tạo 'app = express();'
// và TRƯỚC BẤT KỲ middleware nào khác hoặc định nghĩa route.
// =========================================================

// Cấu hình CORS dựa trên môi trường
let corsOptions;

if (process.env.NODE_ENV === 'production') {
  // Trong môi trường Production, chỉ cho phép từ FRONTEND_URL
  if (!process.env.FRONTEND_URL) {
    console.error('Lỗi: FRONTEND_URL chưa được định nghĩa trong môi trường Production.');
    // Bạn có thể chọn thoát ứng dụng hoặc sử dụng một giá trị mặc định an toàn
    process.exit(1);
  }
  corsOptions = {
    origin: process.env.FRONTEND_URL, // Ví dụ: 'https://luyenthivatli.onrender.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Cho phép gửi cookies, authorization headers
    optionsSuccessStatus: 200 // Đối với một số trình duyệt cũ hơn
  };
  console.log(`CORS Production Mode: Allowing requests from ${process.env.FRONTEND_URL}`);
} else {
  // Trong môi trường Development (local), cho phép tất cả các origin
  corsOptions = {
    origin: '*', // Cho phép mọi origin trong development (ít an toàn, chỉ dùng dev)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  console.log('CORS Development Mode: Allowing all origins (*)');
}

// Áp dụng middleware CORS
app.use(cors(corsOptions));

// Middleware để đọc JSON từ body của request và URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =========================================================
// Định nghĩa các Routes API
// Đặt TẤT CẢ các routes SAU cấu hình CORS
// =========================================================
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/exercises', exerciseRoutes);

// Cấu hình phục vụ Frontend tĩnh (nếu backend phục vụ frontend)
// KHUYẾN NGHỊ: Nếu Frontend và Backend deploy riêng, hãy BỎ QUA phần này.
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '../frontend/out')));
  // app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'out', 'index.html')));
} else {
  // Chỉ là một thông báo đơn giản cho root URL trong môi trường dev/test
  app.get('/', (req, res) => res.send('API is running...'));
}

// Middleware xử lý lỗi tùy chỉnh (luôn đặt cuối cùng)
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
