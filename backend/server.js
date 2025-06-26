// physics-olympiad-website/backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const practiceRoutes = require('./routes/practice'); // Import the new practice routes

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Use cors middleware
app.use(express.json()); // Body parser for JSON data

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/practice', practiceRoutes); // Use the new practice routes

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
