// physics-olympiad-website/backend/controllers/theoryController.js
const Theory = require('../models/Theory'); // Đảm bảo đường dẫn đúng đến Theory model

// @desc    Lấy tất cả các chủ đề lý thuyết
// @route   GET /api/theory
// @access  Public (hoặc Private nếu bạn muốn yêu cầu đăng nhập)
const getTheoryTopics = async (req, res) => {
  try {
    const topics = await Theory.find({}).sort({ category: 1, title: 1 }); // Sắp xếp theo category và title
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách lý thuyết.' });
  }
};

// @desc    Lấy chi tiết một chủ đề lý thuyết theo slug
// @route   GET /api/theory/:slug
// @access  Public (hoặc Private)
const getTheoryBySlug = async (req, res) => {
  try {
    const theory = await Theory.findOne({ slug: req.params.slug });
    if (theory) {
      res.json(theory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết này.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết lý thuyết.' });
  }
};

// @desc    Tạo một chủ đề lý thuyết mới
// @route   POST /api/theory
// @access  Private (Chỉ admin hoặc người có quyền)
const createTheory = async (req, res) => {
  const { title, description, content, category, slug } = req.body; // Bao gồm 'category' và 'slug'

  try {
    // Kiểm tra các trường bắt buộc
    if (!title || !description || !content || !category || !slug) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường: Tiêu đề, Mô tả, Nội dung, Danh mục và Slug.' });
    }

    // Kiểm tra slug có duy nhất không
    const existingTheory = await Theory.findOne({ slug });
    if (existingTheory) {
        return res.status(400).json({ message: 'Slug này đã tồn tại. Vui lòng chọn slug khác.' });
    }

    // Tạo slug từ title nếu không có slug cung cấp
    // Trong trường hợp này, chúng ta yêu cầu slug rõ ràng từ frontend để kiểm soát tốt hơn
    // const generatedSlug = slugify(title, { lower: true, strict: true });

    const theory = new Theory({
      title,
      description,
      content,
      category, // Lưu category
      slug,
      // userId: req.user._id, // Nếu bạn muốn lưu người tạo
    });

    const createdTheory = await theory.save();
    res.status(201).json(createdTheory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo chủ đề lý thuyết.' });
  }
};

// @desc    Cập nhật một chủ đề lý thuyết
// @route   PUT /api/theory/:id
// @access  Private (Chỉ admin hoặc người có quyền)
const updateTheory = async (req, res) => {
  const { title, description, content, category, slug } = req.body;

  try {
    const theory = await Theory.findById(req.params.id);

    if (theory) {
      theory.title = title || theory.title;
      theory.description = description || theory.description;
      theory.content = content || theory.content;
      theory.category = category || theory.category; // Cập nhật category
      theory.slug = slug || theory.slug; // Cập nhật slug

      const updatedTheory = await theory.save();
      res.json(updatedTheory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật chủ đề lý thuyết.' });
  }
};

// @desc    Xóa một chủ đề lý thuyết
// @route   DELETE /api/theory/:id
// @access  Private (Chỉ admin hoặc người có quyền)
const deleteTheory = async (req, res) => {
  try {
    const theory = await Theory.findById(req.params.id);

    if (theory) {
      await theory.deleteOne(); // Sử dụng deleteOne() thay vì remove() cho Mongoose 6+
      res.json({ message: 'Chủ đề lý thuyết đã được xóa.' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa chủ đề lý thuyết.' });
  }
};

module.exports = {
  getTheoryTopics,
  getTheoryBySlug,
  createTheory,
  updateTheory,
  deleteTheory,
};
