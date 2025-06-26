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
// const practiceRoutes = require('./routes/practice'); // THAY ĐỔI: TẠM THỜI VÔ HIỆU HÓA DÒNG NÀY
// const testRoutes = require('./routes/test'); // THAY ĐỔI: TẠM THỜI VÔ HIỆU HÓA DÒNG NÀY (Nếu bạn có file test.js)

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
// app.use('/api/practice', practiceRoutes); // THAY ĐỔI: TẠM THỜI VÔ HIỆU HÓA DÒNG NÀY
// app.use('/api/tests', testRoutes); // THAY ĐỔI: TẠM THỜI VÔ HIỆU HÓA DÒNG NÀY (Nếu bạn có file test.js)


if (process.env.NODE_ENV === 'production') {
  // Production static file serving (if applicable)
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
