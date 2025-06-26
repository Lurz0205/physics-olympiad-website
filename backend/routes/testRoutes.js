// physics-olympiad-website/backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const Test = require('../models/Test'); // Import model Test
const protect = require('../middleware/authMiddleware'); // Middleware để bảo vệ route

// @route   GET /api/tests/
// @desc    Lấy TẤT CẢ các đề thi (chỉ trả về ID và tiêu đề cho danh sách)
// @access  Private (yêu cầu đăng nhập)
router.get('/', protect, async (req, res) => {
  try {
    const tests = await Test.find({}).select('title slug description duration'); // Chỉ lấy các trường cần thiết cho danh sách
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đề thi.' });
  }
});

// @route   GET /api/tests/:slug
// @desc    Lấy chi tiết một đề thi theo slug
// @access  Private (yêu cầu đăng nhập)
router.get('/:slug', protect, async (req, res) => {
  try {
    const test = await Test.findOne({ slug: req.params.slug });

    if (test) {
      // Trả về đề thi, nhưng loại bỏ đáp án đúng và giải thích nếu không phải là admin
      // hoặc nếu bạn muốn người dùng chỉ xem sau khi nộp bài
      // Tùy chỉnh logic này dựa trên yêu cầu của bạn
      const testToSend = {
        _id: test._id,
        title: test.title,
        slug: test.slug,
        description: test.description,
        duration: test.duration,
        questions: test.questions.map(q => ({
          _id: q._id, // Quan trọng để quản lý câu trả lời ở frontend
          questionText: q.questionText,
          options: q.options,
          // KHÔNG gửi correctAnswer và explanation về frontend trừ khi có lý do đặc biệt (ví dụ: admin)
        })),
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
      };
      res.json(testToSend);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đề thi.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đề thi.' });
  }
});


// @route   POST /api/tests
// @desc    Thêm đề thi mới (yêu cầu quyền admin/moderator, hoặc chỉ protect nếu ai cũng tạo được)
// @access  Private (yêu cầu đăng nhập)
router.post('/', protect, async (req, res) => {
  const { title, slug, description, duration, questions } = req.body;

  if (!title || !slug || !description || !duration || !questions || questions.length === 0) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đề thi và câu hỏi.' });
  }

  try {
    const testExists = await Test.findOne({ $or: [{ title }, { slug }] });
    if (testExists) {
      return res.status(400).json({ message: 'Tiêu đề hoặc slug của đề thi đã tồn tại.' });
    }

    const newTest = await Test.create({
      title,
      slug,
      description,
      duration,
      questions, // Đảm bảo các câu hỏi có đủ questionText, options, correctAnswer, explanation
      createdBy: req.user._id, // Gán người tạo đề thi
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi thêm đề thi.' });
  }
});


// Các route khác như PUT, DELETE, GET kết quả có thể được thêm sau.
// Ví dụ: Lấy đáp án đúng và giải thích (chỉ khi nộp bài hoặc là admin)
router.get('/:slug/answers', protect, async (req, res) => {
  try {
    const test = await Test.findOne({ slug: req.params.slug }).select('questions.correctAnswer questions.explanation');
    if (test) {
      res.json(test.questions.map(q => ({ 
        _id: q._id, 
        correctAnswer: q.correctAnswer, 
        explanation: q.explanation 
      })));
    } else {
      res.status(404).json({ message: 'Không tìm thấy đề thi.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy đáp án.' });
  }
});


module.exports = router;
