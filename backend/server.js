// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory'); // Đảm bảo dòng này đã có
const exerciseRoutes = require('./routes/exercise'); // Đảm bảo dòng này đã có

connectDB();

const app = express();
const port = process.env.PORT || 5000;

// THAY ĐỔI QUAN TRỌNG: Cấu hình CORS để cho phép Frontend của bạn
// Điều này cần được đặt NGAY SAU khi khởi tạo 'app = express();' và TRƯỚC khi định nghĩa bất kỳ routes nào khác.
app.use(cors({
  origin: process.env.FRONTEND_URL, // Chỉ cho phép yêu cầu từ URL Frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức HTTP này
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các headers này
  credentials: true, // Cho phép gửi cookies, authorization headers, v.v.
}));

app.use(express.json()); // Cho phép Express đọc JSON từ body của request
app.use(express.urlencoded({ extended: false })); // Cho phép Express đọc dữ liệu từ URL-encoded forms

// Use routes - Đặt tất cả các routes SAU cấu hình CORS
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes); // Đảm bảo đã có
app.use('/api/exercises', exerciseRoutes); // Đảm bảo đã có

// Serve frontend (nếu bạn có cấu hình phục vụ frontend từ backend)
if (process.env.NODE_ENV === 'production') {
  // Cấu hình phục vụ các file tĩnh của Next.js build
  // app.use(express.static(path.join(__dirname, '../frontend/out'))); 
  // app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'out', 'index.html')));
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

app.use(errorHandler); // Middleware xử lý lỗi tùy chỉnh

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
