const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const questionsData = require('../data/questionsData'); // Import dữ liệu câu hỏi cứng

// @route   GET /api/questions
// @desc    Lấy tất cả các câu hỏi bài tập từ dữ liệu cứng, có thể lọc theo testId
// @access  Private (yêu cầu đăng nhập)
router.get('/', protect, async (req, res) => {
  try {
    const { testId } = req.query; // Lấy testId từ query parameter
    let filteredQuestions = questionsData;
    if (testId) {
      filteredQuestions = questionsData.filter(q => q.testId === testId);
    }
    // Trả về dữ liệu câu hỏi cứng đã lọc
    res.json(filteredQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy câu hỏi.' });
  }
});

// @route   GET /api/questions/test-ids
// @desc    Lấy danh sách các testId độc đáo từ dữ liệu cứng
// @access  Private (yêu cầu đăng nhập)
router.get('/test-ids', protect, async (req, res) => {
  try {
    // Lấy tất cả các testId duy nhất từ mảng dữ liệu cứng
    const testIds = [...new Set(questionsData.map(q => q.testId))];
    res.json(testIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đề thi.' });
  }
});

module.exports = router;
