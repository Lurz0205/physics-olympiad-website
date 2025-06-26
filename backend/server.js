// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const exerciseRoutes = require('./routes/exercise');
const examRoutes = require('./routes/exam'); // THAY ĐỔI MỚI: Import examRoutes

// const practiceRoutes = require('./routes/practice'); // Vẫn giữ comment nếu bạn chưa muốn dùng
// const testRoutes = require('./routes/test'); // Vẫn giữ comment nếu bạn chưa muốn dùng

connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Cấu hình CORS
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exams', examRoutes); // THAY ĐỔI MỚI: Thêm Exam Routes

// app.use('/api/practice', practiceRoutes); // Vẫn giữ comment nếu bạn chưa muốn dùng
// app.use('/api/tests', testRoutes); // Vẫn giữ comment nếu bạn chưa muốn dùng

if (process.env.NODE_ENV === 'production') {
  // Production static file serving (if applicable)
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
