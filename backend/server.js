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

// THAY ĐỔI QUAN TRỌNG TẠI ĐÂY: Tăng giới hạn kích thước request body
app.use(express.json({ limit: '50mb' })); // Cho JSON bodies
app.use(express.urlencoded({ limit: '50mb', extended: false })); // Cho URL-encoded bodies (form submissions)

// Add a root route for '/' to confirm API is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API của Luyện thi Vật lý đang hoạt động!' });
});

// Define API routes, ensuring correct file paths based on your actual file names
// If your route files are named: auth.js, theory.js, exercise.js, exam.js, examResult.js, userRoutes.js
app.use('/api/users', require('./routes/userRoutes'));    // This seems to be correct based on your file structure
app.use('/api/auth', require('./routes/auth'));           // Corrected: changed from authRoutes to auth
app.use('/api/theory', require('./routes/theory'));       // Corrected: changed from theoryRoutes to theory
app.use('/api/exercises', require('./routes/exercise'));  // Corrected: changed from exerciseRoutes to exercise
app.use('/api/exams', require('./routes/exam'));          // Corrected: assuming exam.js
app.use('/api/exam-results', require('./routes/examResult')); // Corrected: assuming examResult.js

// Serve frontend (if you have setup to serve from backend)
// This part is for serving static Next.js build if frontend is co-located with backend
// If your frontend is deployed separately, this block might be redundant or configured differently
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/out')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'out', 'index.html')
    )
  );
} else {
  // In development, if accessing root, tell user to set to production
  // This is usually for backend testing in dev mode
  app.get('/', (req, res) => res.send('Please set to production'));
}

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
