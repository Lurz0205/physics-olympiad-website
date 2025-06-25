const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const theoriesData = require('../data/theoriesData'); // Import dữ liệu lý thuyết cứng

// @route   GET /api/theory
// @desc    Lấy tất cả các chủ đề lý thuyết từ dữ liệu cứng
// @access  Private (yêu cầu đăng nhập)
router.get('/', protect, async (req, res) => {
  try {
    // Trả về tất cả dữ liệu lý thuyết cứng
    res.json(theoriesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy lý thuyết.' });
  }
});

// @route   GET /api/theory/:slug
// @desc    Lấy chi tiết một chủ đề lý thuyết theo slug từ dữ liệu cứng
// @access  Private (yêu cầu đăng nhập)
router.get('/:slug', protect, async (req, res) => {
  try {
    const { slug } = req.params;
    // Tìm lý thuyết theo slug trong mảng dữ liệu cứng
    const theory = theoriesData.find(t => t.slug === slug);

    if (theory) {
      res.json(theory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết lý thuyết.' });
  }
});

module.exports = router;
