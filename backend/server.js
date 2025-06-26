// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors'); // Optional for colored console output
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const exerciseRoutes = require('./routes/exercise'); // THAY ĐỔI: Thêm dòng này

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Sử dụng CORS
app.use(express.json()); // Cho phép Express đọc JSON từ body của request
app.use(express.urlencoded({ extended: false })); // Cho phép Express đọc dữ liệu từ URL-encoded forms

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/exercises', exerciseRoutes); // THAY ĐỔI: Thêm dòng này

// Serve frontend (nếu bạn có cấu hình phục vụ frontend từ backend)
if (process.env.NODE_ENV === 'production') {
  // Cấu hình phục vụ các file tĩnh của Next.js build
  // (Bạn có thể bỏ qua phần này nếu bạn deploy frontend và backend riêng)
  // app.use(express.static(path.join(__dirname, '../frontend/out'))); 

  // app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'out', 'index.html')));
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

app.use(errorHandler); // Middleware xử lý lỗi tùy chỉnh

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
