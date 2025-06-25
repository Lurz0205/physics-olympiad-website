const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const questionRoutes = require('./routes/questions');
const testResultRoutes = require('./routes/testResults');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database (only for user accounts and test results)
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/test-results', testResultRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
