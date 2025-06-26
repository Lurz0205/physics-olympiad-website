// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors

// Import các file route
const authRoutes = require('./routes/auth'); // Đảm bảo đã import authRoutes
const theoryRoutes = require('./routes/theory');
const practiceRoutes = require('./routes/practice');
const testRoutes = require('./routes/testRoutes');

dotenv.config();

connectDB(); // Kết nối MongoDB

const app = express();

app.use(cors()); // Sử dụng middleware CORS
app.use(express.json()); // Body parser cho dữ liệu JSON

// Định nghĩa các API routes
app.use('/api/auth', authRoutes); // Sử dụng authRoutes
app.use('/api/theory', theoryRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/tests', testRoutes);

// Route gốc
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
