// physics-olympiad-website/backend/controllers/testController.js
const Test = require('../models/Test');
const TestQuestion = require('../models/TestQuestion');

// @desc    Lấy tất cả các đề thi
// @route   GET /api/tests
// @access  Public
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({}).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách đề thi.' });
  }
};

// @desc    Lấy chi tiết một đề thi theo slug và các câu hỏi của nó
// @route   GET /api/tests/:slug
// @access  Private (vì có câu hỏi và đáp án)
const getTestBySlug = async (req, res) => {
  try {
    const test = await Test.findOne({ slug: req.params.slug });
    if (!test) {
      return res.status(404).json({ message: 'Không tìm thấy đề thi này.' });
    }
    const questions = await TestQuestion.find({ test: test._id }).sort({ createdAt: 1 });
    res.json({ test, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết đề thi.' });
  }
};

// @desc    Lấy đáp án đúng và giải thích cho một đề thi (để tính điểm/hiển thị kết quả)
// @route   GET /api/tests/:testId/answers
// @access  Private (chỉ sau khi người dùng nộp bài hoặc là admin)
const getTestAnswers = async (req, res) => {
  try {
    const questions = await TestQuestion.find({ test: req.params.testId }).select('correctAnswer explanation');
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy đáp án.' });
  }
};


// @desc    Tạo một đề thi mới
// @route   POST /api/tests
// @access  Private (Admin only)
const createTest = async (req, res) => {
  const { title, slug, description, duration, category } = req.body;

  try {
    if (!title || !slug || !description || !duration || !category) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Tiêu đề, Slug, Mô tả, Thời lượng và Danh mục cho đề thi.' });
    }
    const existingTest = await Test.findOne({ slug });
    if (existingTest) {
        return res.status(400).json({ message: 'Slug của đề thi đã tồn tại.' });
    }

    const newTest = await Test.create({ title, slug, description, duration, category });
    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Tiêu đề hoặc slug của đề thi đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo đề thi.' });
  }
};

// @desc    Cập nhật một đề thi
// @route   PUT /api/tests/:id
// @access  Private (Admin only)
const updateTest = async (req, res) => {
  const { title, slug, description, duration, category } = req.body;
  const { id } = req.params;

  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: 'Không tìm thấy đề thi.' });
    }

    // Kiểm tra trùng slug nếu slug thay đổi
    if (slug && slug !== test.slug) {
        const existingTestWithSlug = await Test.findOne({ slug });
        if (existingTestWithSlug && String(existingTestWithSlug._id) !== id) {
            return res.status(400).json({ message: 'Slug này đã tồn tại cho một đề thi khác.' });
        }
    }

    test.title = title || test.title;
    test.slug = slug || test.slug;
    test.description = description || test.description;
    test.duration = duration || test.duration;
    test.category = category || test.category;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Tiêu đề hoặc slug đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật đề thi.' });
  }
};

// @desc    Xóa một đề thi và tất cả câu hỏi liên quan
// @route   DELETE /api/tests/:id
// @access  Private (Admin only)
const deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: 'Không tìm thấy đề thi.' });
    }

    await TestQuestion.deleteMany({ test: test._id }); // Xóa tất cả câu hỏi của đề thi này
    await test.deleteOne();
    res.json({ message: 'Đề thi và các câu hỏi liên quan đã được xóa.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa đề thi.' });
  }
};

// @desc    Tạo một câu hỏi đề thi mới cho một đề thi
// @route   POST /api/tests/:testId/questions
// @access  Private (Admin only)
const createTestQuestion = async (req, res) => {
  const { testId } = req.params;
  const { questionText, options, correctAnswer, explanation } = req.body;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Không tìm thấy đề thi này.' });
    }
    if (!questionText || !options || options.length < 2 || !correctAnswer) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ nội dung câu hỏi, lựa chọn và đáp án đúng.' });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Đáp án đúng phải là một trong các lựa chọn.' });
    }

    const newQuestion = await TestQuestion.create({
      test: testId,
      questionText,
      options,
      correctAnswer,
      explanation,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo câu hỏi đề thi.' });
  }
};

// @desc    Cập nhật một câu hỏi đề thi
// @route   PUT /api/tests/questions/:id
// @access  Private (Admin only)
const updateTestQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer, explanation } = req.body;

  try {
    const question = await TestQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi đề thi.' });
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

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật câu hỏi đề thi.' });
  }
};

// @desc    Xóa một câu hỏi đề thi
// @route   DELETE /api/tests/questions/:id
// @access  Private (Admin only)
const deleteTestQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await TestQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi đề thi.' });
    }
    await question.deleteOne();
    res.json({ message: 'Câu hỏi đề thi đã được xóa.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa câu hỏi đề thi.' });
  }
};


module.exports = {
  getTests,
  getTestBySlug,
  getTestAnswers,
  createTest,
  updateTest,
  deleteTest,
  createTestQuestion,
  updateTestQuestion,
  deleteTestQuestion,
};
