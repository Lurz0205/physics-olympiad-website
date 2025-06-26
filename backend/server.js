// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const exerciseRoutes = require('./routes/exercise');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

// THAY ĐỔI QUAN TRỌNG: Cấu hình CORS để cho phép Frontend của bạn
// Điều này cần được đặt TRƯỚC khi bạn định nghĩa các routes
app.use(cors({
  origin: process.env.FRONTEND_URL, // Chỉ cho phép yêu cầu từ URL Frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức HTTP này
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các headers này
  credentials: true, // Cho phép gửi cookies, authorization headers, v.v.
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/exercises', exerciseRoutes);

// Serve frontend (nếu bạn có cấu hình phục vụ frontend từ backend)
if (process.env.NODE_ENV === 'production') {
  // ... (giữ nguyên hoặc bỏ qua phần này nếu frontend và backend deploy riêng)
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
