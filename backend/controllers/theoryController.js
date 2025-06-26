// physics-olympiad-website/backend/controllers/theoryController.js
const Theory = require('../models/Theory');

// ... (Các hàm getTheoryTopics, getTheoryBySlug, createTheory đã có) ...

// @desc    Lấy chi tiết một chủ đề lý thuyết theo ID
// @route   GET /api/theory/:id
// @access  Private (chỉ admin dùng)
const getTheoryById = async (req, res) => { // THAY ĐỔI MỚI: Thêm hàm này
  try {
    const theory = await Theory.findById(req.params.id); // Tìm theo ID
    if (theory) {
      res.json(theory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết này.' });
    }
  } catch (error) {
    console.error(error);
    // Xử lý trường hợp ID không hợp lệ (ví dụ: ObjectId invalid)
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID chủ đề lý thuyết không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết lý thuyết theo ID.' });
  }
};

// ... (Các hàm updateTheory, deleteTheory đã có) ...

module.exports = {
  getTheoryTopics,
  getTheoryBySlug,
  getTheoryById, // THAY ĐỔI MỚI: Export hàm này
  createTheory,
  updateTheory,
  deleteTheory,
};
