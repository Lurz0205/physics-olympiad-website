const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const UserTestResult = require('./models/UserTestResult');

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Để xóa người dùng hoặc kết quả bài làm:
    // console.log('Clearing existing user data and test results...');
    // await User.deleteMany({});
    // await UserTestResult.deleteMany({});
    // console.log('Existing user data and test results cleared.');

    // Để thêm người dùng mẫu (chỉ chạy khi chưa có tài khoản test):
    // const sampleUserCount = await User.countDocuments({ username: 'testuser' });
    // if (sampleUserCount === 0) {
    //   await User.create({
    //     username: 'testuser',
    //     password: 'testpassword123', // Mật khẩu sẽ được hash tự động
    //   });
    //   console.log('Sample user "testuser" added!');
    // } else {
    //   console.log('Sample user "testuser" already exists.');
    // }

    console.log('Data seeding process complete (only for users/results if enabled).');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
