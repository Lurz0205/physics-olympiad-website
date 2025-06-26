// physics-olympiad-website/backend/routes/practice.js
const express = require('express');
const router = express.Router();
const PracticeQuestion = require('../models/PracticeQuestion'); // Existing model
const PracticeTopic = require('../models/PracticeTopic');     // New model
const protect = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// @route   GET /api/practice/topics
// @desc    Get all practice topics
// @access  Private (requires authentication)
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await PracticeTopic.find({});
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách chủ đề bài tập.' });
  }
});

// @route   GET /api/practice/topics/:slug/questions
// @desc    Get practice questions for a specific topic (by slug)
// @access  Private (requires authentication)
router.get('/topics/:slug/questions', protect, async (req, res) => {
  try {
    const { slug } = req.params;
    const topic = await PracticeTopic.findOne({ slug });

    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề bài tập không tìm thấy.' });
    }

    // Find all questions associated with this topic
    // Assuming PracticeQuestion has a 'topic' field referencing PracticeTopic's _id
    // If your PracticeQuestion model doesn't have a 'topic' field, you'll need to add it:
    // topic: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeTopic', required: true }
    const questions = await PracticeQuestion.find({ topic: topic._id });

    res.json({ topic: topic, questions: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy câu hỏi cho chủ đề.' });
  }
});


// @route   GET /api/practice
// @desc    Get ALL practice questions (if needed, otherwise remove this route)
// @access  Private (requires authentication)
// Note: This route will now return all questions regardless of topic.
// It might be redundant if you always want questions by topic.
router.get('/', protect, async (req, res) => {
  try {
    const questions = await PracticeQuestion.find({});
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy tất cả câu hỏi bài tập.' });
  }
});

// @route   POST /api/practice
// @desc    Add a new practice question (requires admin/moderator, or just protect)
// @access  Private (requires authentication)
router.post('/', protect, async (req, res) => {
  const { topicSlug, questionText, options, correctAnswer, explanation } = req.body;

  if (!topicSlug || !questionText || !options || !correctAnswer) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin câu hỏi.' });
  }

  try {
    const topic = await PracticeTopic.findOne({ slug: topicSlug });
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề bài tập không tìm thấy. Vui lòng tạo chủ đề trước.' });
    }

    const question = await PracticeQuestion.create({
      topic: topic._id, // Associate question with the topic's ID
      questionText,
      options,
      correctAnswer,
      explanation,
      author: req.user._id, // Assuming authMiddleware sets req.user
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi thêm câu hỏi bài tập.' });
  }
});

// @route   GET /api/practice/:id
// @desc    Get a single practice question by ID
// @access  Private (requires authentication)
router.get('/:id', protect, async (req, res) => {
  try {
    const question = await PracticeQuestion.findById(req.params.id);

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Câu hỏi không tìm thấy.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy câu hỏi.' });
  }
});

// @route   PUT /api/practice/:id
// @desc    Update a practice question by ID
// @access  Private (requires authentication)
router.put('/:id', protect, async (req, res) => {
  const { questionText, options, correctAnswer, explanation } = req.body;

  try {
    const question = await PracticeQuestion.findById(req.params.id);

    if (question) {
      question.questionText = questionText || question.questionText;
      question.options = options || question.options;
      question.correctAnswer = correctAnswer || question.correctAnswer;
      question.explanation = explanation || question.explanation;

      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Câu hỏi không tìm thấy.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật câu hỏi.' });
  }
});

// @route   DELETE /api/practice/:id
// @desc    Delete a practice question by ID
// @access  Private (requires authentication)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await PracticeQuestion.findById(req.params.id);

    if (question) {
      await question.deleteOne(); // Use deleteOne()
      res.json({ message: 'Câu hỏi đã được xóa.' });
    } else {
      res.status(404).json({ message: 'Câu hỏi không tìm thấy.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi xóa câu hỏi.' });
  }
});

module.exports = router;
