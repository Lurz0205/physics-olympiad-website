// physics-olympiad-website/backend/controllers/practiceController.js
const PracticeTopic = require('../models/PracticeTopic');
const PracticeQuestion = require('../models/PracticeQuestion');

// @desc    Lấy tất cả các chủ đề bài tập
// @route   GET /api/practice/topics
// @access  Public
const getPracticeTopics = async (req, res) => {
  try {
    const topics = await PracticeTopic.find({}).sort({ category: 1, title: 1 });
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách chủ đề bài tập.' });
  }
};

// @desc    Lấy chi tiết một chủ đề bài tập theo slug và các câu hỏi của nó
// @route   GET /api/practice/topics/:slug/questions
// @access  Private (vì có câu hỏi)
const getPracticeQuestionsByTopicSlug = async (req, res) => {
  try {
    const topic = await PracticeTopic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề bài tập này.' });
    }
    const questions = await PracticeQuestion.find({ topic: topic._id }).sort({ createdAt: 1 });
    res.json({ topic, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy câu hỏi cho chủ đề bài tập.' });
  }
};

// @desc    Tạo một chủ đề bài tập mới
// @route   POST /api/practice/topics
// @access  Private (Admin only)
const createPracticeTopic = async (req, res) => {
  const { title, description, category, slug } = req.body;

  try {
    if (!title || !description || !category || !slug) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Tiêu đề, Mô tả, Danh mục và Slug cho chủ đề.' });
    }
    const existingTopic = await PracticeTopic.findOne({ slug });
    if (existingTopic) {
        return res.status(400).json({ message: 'Slug của chủ đề bài tập đã tồn tại.' });
    }

    const newTopic = await PracticeTopic.create({ title, description, category, slug });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Tiêu đề hoặc slug của chủ đề bài tập đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo chủ đề bài tập.' });
  }
};

// @desc    Cập nhật một chủ đề bài tập
// @route   PUT /api/practice/topics/:id
// @access  Private (Admin only)
const updatePracticeTopic = async (req, res) => {
  const { title, description, category, slug } = req.body;
  const { id } = req.params;

  try {
    const topic = await PracticeTopic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề bài tập.' });
    }

    // Kiểm tra trùng slug nếu slug thay đổi
    if (slug && slug !== topic.slug) {
        const existingTopicWithSlug = await PracticeTopic.findOne({ slug });
        if (existingTopicWithSlug && String(existingTopicWithSlug._id) !== id) {
            return res.status(400).json({ message: 'Slug này đã tồn tại cho một chủ đề khác.' });
        }
    }

    topic.title = title || topic.title;
    topic.description = description || topic.description;
    topic.category = category || topic.category;
    topic.slug = slug || topic.slug;

    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'Tiêu đề hoặc slug đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật chủ đề bài tập.' });
  }
};

// @desc    Xóa một chủ đề bài tập và tất cả câu hỏi liên quan
// @route   DELETE /api/practice/topics/:id
// @access  Private (Admin only)
const deletePracticeTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await PracticeTopic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề bài tập.' });
    }

    await PracticeQuestion.deleteMany({ topic: topic._id }); // Xóa tất cả câu hỏi của chủ đề này
    await topic.deleteOne();
    res.json({ message: 'Chủ đề bài tập và các câu hỏi liên quan đã được xóa.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa chủ đề bài tập.' });
  }
};

// @desc    Tạo một câu hỏi bài tập mới cho một chủ đề
// @route   POST /api/practice/topics/:topicId/questions
// @access  Private (Admin only)
const createPracticeQuestion = async (req, res) => {
  const { topicId } = req.params;
  const { questionText, options, correctAnswer, explanation, difficulty } = req.body;

  try {
    const topic = await PracticeTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề bài tập này.' });
    }
    if (!questionText || !options || options.length < 2 || !correctAnswer) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ nội dung câu hỏi, lựa chọn và đáp án đúng.' });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Đáp án đúng phải là một trong các lựa chọn.' });
    }

    const newQuestion = await PracticeQuestion.create({
      topic: topicId,
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo câu hỏi bài tập.' });
  }
};

// @desc    Cập nhật một câu hỏi bài tập
// @route   PUT /api/practice/questions/:id
// @access  Private (Admin only)
const updatePracticeQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer, explanation, difficulty } = req.body;

  try {
    const question = await PracticeQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi bài tập.' });
    }
    if (options && options.length < 2) {
      return res.status(400).json({ message: 'Mỗi câu hỏi phải có ít nhất 2 lựa chọn.' });
    }
    if (correctAnswer && options && !options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Đáp án đúng phải là một trong các lựa chọn.' });
    }

    question.questionText = questionText || question.questionText;
    question.options = options || question.options;
    question.correctAnswer = correctAnswer || question.correctAnswer;
    question.explanation = explanation || question.explanation;
    question.difficulty = difficulty || question.difficulty;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật câu hỏi bài tập.' });
  }
};

// @desc    Xóa một câu hỏi bài tập
// @route   DELETE /api/practice/questions/:id
// @access  Private (Admin only)
const deletePracticeQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await PracticeQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi bài tập.' });
    }
    await question.deleteOne();
    res.json({ message: 'Câu hỏi bài tập đã được xóa.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa câu hỏi bài tập.' });
  }
};

module.exports = {
  getPracticeTopics,
  getPracticeQuestionsByTopicSlug,
  createPracticeTopic,
  updatePracticeTopic,
  deletePracticeTopic,
  createPracticeQuestion,
  updatePracticeQuestion,
  deletePracticeQuestion,
};
