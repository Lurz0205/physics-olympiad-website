// physics-olympiad-website/backend/server.js
const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors()); // Sử dụng cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =================================================================
// THAY ĐỔI MỚI: Thêm route cho đường dẫn gốc '/'
// =================================================================
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API của Luyện thi Vật lý đang hoạt động!' });
});
// =================================================================

// Routes API của bạn
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/theory', require('./routes/theoryRoutes')); // Đảm bảo đúng routes
app.use('/api/exercises', require('./routes/exerciseRoutes')); // Đảm bảo đúng routes
app.use('/api/exams', require('./routes/examRoutes')); // Đảm bảo đúng routes
app.use('/api/exam-results', require('./routes/examResultRoutes')); // Đảm bảo đúng routes

// Serve frontend (nếu bạn có setup để serve từ backend)
// Nếu Frontend được deploy riêng, phần này có thể không cần thiết hoặc khác đi
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/out')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'out', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
