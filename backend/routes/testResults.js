const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const UserTestResult = require('../models/UserTestResult');
const questionsData = require('../data/questionsData'); // Import dữ liệu câu hỏi cứng để chấm điểm

// @route   POST /api/test-results
// @desc    Gửi kết quả bài thi của người dùng và chấm điểm từ dữ liệu cứng
// @access  Private
router.post('/', protect, async (req, res) => {
  const { testId, userAnswers, timeTakenSeconds } = req.body; // userAnswers là một object { questionId: "selectedOption" }

  if (!testId || !userAnswers || typeof timeTakenSeconds === 'undefined') {
    return res.status(400).json({ message: 'Dữ liệu kết quả không hợp lệ.' });
  }

  try {
    // Lấy tất cả câu hỏi của đề thi này từ dữ liệu cứng để chấm điểm
    const questionsInTest = questionsData.filter(q => q.testId === testId);

    if (questionsInTest.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đề thi này.' });
    }

    let score = 0;
    questionsInTest.forEach(q => {
      // Chấm điểm bằng cách so sánh đáp án của người dùng với đáp án đúng trong dữ liệu cứng
      if (userAnswers[q._id] === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = questionsInTest.length;

    // Lưu kết quả vào database MongoDB
    const result = await UserTestResult.create({
      user: req.user._id, // req.user được gán từ middleware protect
      testId,
      score,
      totalQuestions,
      timeTakenSeconds,
    });

    res.status(201).json({
      message: 'Kết quả bài thi đã được lưu.',
      result,
      score,
      totalQuestions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lưu kết quả bài thi.' });
  }
});

// @route   GET /api/test-results/me
// @desc    Lấy lịch sử bài thi của người dùng hiện tại
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const results = await UserTestResult.find({ user: req.user._id }).sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử bài thi.' });
  }
});

// @route   GET /api/test-results/leaderboard/:testId
// @desc    Lấy bảng xếp hạng cho một đề thi cụ thể
// @access  Private (hoặc Public nếu bạn muốn hiển thị cho mọi người)
router.get('/leaderboard/:testId', protect, async (req, res) => {
  try {
    const { testId } = req.params;
    const leaderboard = await UserTestResult.aggregate([
      { $match: { testId: testId } },
      {
        $group: {
          _id: "$user", // Nhóm theo người dùng
          bestScore: { $max: "$score" }, // Lấy điểm cao nhất
          lastSubmittedAt: { $max: "$submittedAt" }, // Lấy thời gian nộp bài gần nhất
        }
      },
      {
        $lookup: { // Join với collection User để lấy username
          from: "users", // Tên collection trong MongoDB (thường là số nhiều, chữ thường)
          localField: "_id",
          foreignField: "_id",
          as: "user_info"
        }
      },
      {
        $unwind: "$user_info" // Giải cấu trúc mảng user_info
      },
      {
        $project: { // Chọn các trường muốn hiển thị
          _id: 0,
          userId: "$_id",
          username: "$user_info.username",
          bestScore: 1,
          lastSubmittedAt: 1
        }
      },
      { $sort: { bestScore: -1, lastSubmittedAt: 1 } }, // Sắp xếp giảm dần theo điểm, tăng dần theo thời gian nộp
      { $limit: 100 } // Giới hạn số lượng hiển thị trên bảng xếp hạng
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy bảng xếp hạng.' });
  }
});


module.exports = router;
