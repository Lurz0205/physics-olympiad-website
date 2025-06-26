// backend/server.js
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const connectDB = require('./config/db');
const cors = require('cors');

// Import Models
const Theory = require('./models/Theory');
const PracticeTopic = require('./models/PracticeTopic');
const Test = require('./models/Test');

// Import Routes
const authRoutes = require('./routes/auth');
const theoryRoutes = require('./routes/theory');
const practiceRoutes = require('./routes/practice');
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes'); // THAY ĐỔI MỚI: Import userRoutes

const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dữ liệu mẫu ban đầu cho lý thuyết (chỉ để tự động seed nếu database trống)
const initialTheoryData = [
  {
    title: "Chuyển động thẳng đều",
    slug: "chuyen-dong-thang-deu",
    description: "Nghiên cứu về chuyển động thẳng đều và các công thức cơ bản.",
    content: "### 1. Định nghĩa\nChuyển động thẳng đều là chuyển động có quỹ đạo là đường thẳng và tốc độ trung bình như nhau trên mọi quãng đường. $$v = \\frac{s}{t}$$\n\n### 2. Phương trình chuyển động\n$$x = x_0 + vt$$",
    category: "CƠ HỌC"
  },
  {
    title: "Định luật I Newton",
    slug: "dinh-luat-i-newton",
    description: "Tìm hiểu về định luật I Newton và khái niệm quán tính.",
    content: "### 1. Phát biểu\nMột vật đang đứng yên sẽ tiếp tục đứng yên, hoặc đang chuyển động thẳng đều sẽ tiếp tục chuyển động thẳng đều, nếu không có lực nào tác dụng vào nó hoặc tổng hợp các lực tác dụng bằng không.",
    category: "CƠ HỌC"
  },
  {
    title: "Định luật Ôm",
    slug: "dinh-luat-om",
    description: "Tìm hiểu về định luật Ôm và ứng dụng trong mạch điện.",
    content: "### 1. Phát biểu\nCường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây. $$I = \\frac{U}{R}$$\n\n### 2. Các đại lượng\n* $I$: Cường độ dòng điện (A)\n* $U$: Hiệu điện thế (V)\n* $R$: Điện trở (Ohm)",
    category: "ĐIỆN HỌC"
  },
  {
    title: "Mạch điện RLC nối tiếp",
    slug: "mach-dien-rlc-noi-tiep",
    description: "Phân tích mạch điện xoay chiều với điện trở, cuộn cảm và tụ điện mắc nối tiếp.",
    content: "### 1. Tổng trở\nTổng trở của mạch RLC nối tiếp được tính bằng công thức:\n$$Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$$\nTrong đó $Z_L = \\omega L$ và $Z_C = \\frac{1}{\\omega C}$.",
    category: "ĐIỆN HỌC"
  },
  {
    title: "Cân bằng nhiệt",
    slug: "can-bang-nhiet",
    description: "Nguyên lý cân bằng nhiệt và các ứng dụng.",
    content: "### 1. Định luật bảo toàn và chuyển hóa năng lượng\nTrong một hệ kín, nhiệt lượng do vật nóng tỏa ra bằng nhiệt lượng do vật lạnh thu vào.",
    category: "NHIỆT HỌC"
  }
];

// Hàm để seed dữ liệu lý thuyết ban đầu nếu collection trống
const seedTheoryData = async () => {
  try {
    const count = await Theory.countDocuments();
    if (count === 0) { // Chỉ seed nếu collection trống
      await Theory.insertMany(initialTheoryData);
      console.log('Database seeded with initial theory data.'.green.inverse);
    } else {
      console.log('Theory collection already contains data. Skipping seed.'.yellow);
    }
  } catch (error) {
    console.error(`Error seeding theory data: ${error.message}`.red.inverse);
  }
};

// Định nghĩa các Route API
app.use('/api/auth', authRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes); // THAY ĐỔI MỚI: Sử dụng userRoutes cho quản lý người dùng


// Route mặc định cho kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// BẮT ĐẦU SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`.cyan.bold);
  // Gọi hàm seed dữ liệu khi server khởi động
  await seedTheoryData();
});
