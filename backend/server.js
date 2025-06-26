// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes chính thức
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const exerciseRoutes = require('./routes/exercise');
const examRoutes = require('./routes/exam'); // Import route cho đề thi Online

// =========================================================
// THAY ĐỔI: Đã loại bỏ các import thừa / không dùng đến
// const practiceRoutes = require('./routes/practice');
// const testRoutes = require('./routes/testRoutes'); // Hoặc test.js nếu bạn có
// const questionsRoutes = require('./routes/questions');
// =========================================================

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Cấu hình CORS (Đảm bảo phần này được đặt đúng vị trí)
let corsOptions;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL) {
    console.error('Lỗi: FRONTEND_URL chưa được định nghĩa trong môi trường Production.');
    process.exit(1);
  }
  corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  console.log(`CORS Production Mode: Allowing requests from ${process.env.FRONTEND_URL}`);
} else {
  corsOptions = {
    origin: '*',
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

// Định nghĩa các Routes API chính thức
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exams', examRoutes); // Sử dụng route cho đề thi Online

// =========================================================
// THAY ĐỔI: Đã loại bỏ các dòng `app.use` thừa / không dùng đến
// app.use('/api/practice', practiceRoutes);
// app.use('/api/tests', testRoutes);
// app.use('/api/questions', questionsRoutes);
// =========================================================

// Cấu hình phục vụ Frontend tĩnh (nếu backend phục vụ frontend)
if (process.env.NODE_ENV === 'production') {
  // Logic phục vụ frontend production (nếu có)
  // app.use(express.static(path.join(__dirname, '../frontend/out')));
  // app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'out', 'index.html')));
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

// Middleware xử lý lỗi tùy chỉnh (luôn đặt cuối cùng)
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
