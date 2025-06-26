// physics-olympiad-website/backend/controllers/theoryController.js
const Theory = require('../models/Theory'); // Đảm bảo đường dẫn đúng đến Theory model

// @desc    Lấy tất cả các chủ đề lý thuyết
// @route   GET /api/theory
// @access  Public (hoặc Private nếu bạn muốn yêu cầu đăng nhập)
const getTheoryTopics = async (req, res) => {
  try {
    // Sắp xếp theo category và title để đảm bảo thứ tự hiển thị trên frontend
    const topics = await Theory.find({}).sort({ category: 1, title: 1 });
    res.json(topics);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lý thuyết:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách lý thuyết.' });
  }
};

// @desc    Lấy chi tiết một chủ đề lý thuyết theo slug (dùng cho trang hiển thị chi tiết cho user)
// @route   GET /api/theory/slug/:slug
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
    console.error('Lỗi khi lấy lý thuyết theo slug:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết lý thuyết.' });
  }
};

// @desc    Lấy chi tiết một chủ đề lý thuyết theo ID (dùng cho trang admin chỉnh sửa)
// @route   GET /api/theory/:id
// @access  Private (chỉ admin dùng)
const getTheoryById = async (req, res) => {
  try {
    const theory = await Theory.findById(req.params.id); // Tìm theo ID
    if (theory) {
      res.json(theory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết này.' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy lý thuyết theo ID:', error);
    // Xử lý trường hợp ID không hợp lệ (ví dụ: ObjectId invalid)
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID chủ đề lý thuyết không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết lý thuyết theo ID.' });
  }
};

// @desc    Tạo một chủ đề lý thuyết mới
// @route   POST /api/theory
// @access  Private (Chỉ admin hoặc người có quyền)
const createTheory = async (req, res) => {
  const { title, description, content, category, slug } = req.body;

  try {
    if (!title || !description || !content || !category || !slug) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường: Tiêu đề, Mô tả, Nội dung, Danh mục và Slug.' });
    }

    const existingTheory = await Theory.findOne({ slug });
    if (existingTheory) {
        return res.status(400).json({ message: 'Slug này đã tồn tại. Vui lòng chọn slug khác.' });
    }

    const theory = new Theory({
      title,
      description,
      content,
      category,
      slug,
    });

    const createdTheory = await theory.save();
    res.status(201).json(createdTheory);
  } catch (error) {
    console.error('Lỗi khi tạo lý thuyết:', error);
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return res.status(400).json({ message: `Trường '${field}' với giá trị '${value}' đã tồn tại.` });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo chủ đề lý thuyết.' });
  }
};

// @desc    Cập nhật một chủ đề lý thuyết
// @route   PUT /api/theory/:id
// @access  Private (Chỉ admin hoặc người có quyền)
const updateTheory = async (req, res) => {
  const { title, description, content, category, slug } = req.body;
  const { id } = req.params;

  try {
    const theory = await Theory.findById(id);

    if (theory) {
      // Kiểm tra trùng slug nếu slug thay đổi và trùng với bài khác
      if (slug && slug !== theory.slug) {
          const existingTheoryWithNewSlug = await Theory.findOne({ slug });
          if (existingTheoryWithNewSlug && String(existingTheoryWithNewSlug._id) !== id) {
              return res.status(400).json({ message: 'Slug này đã tồn tại cho một chủ đề khác.' });
          }
      }

      theory.title = title || theory.title;
      theory.description = description || theory.description;
      theory.content = content || theory.content;
      theory.category = category || theory.category;
      theory.slug = slug || theory.slug;

      const updatedTheory = await theory.save();
      res.json(updatedTheory);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chủ đề lý thuyết.' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật lý thuyết:', error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Tiêu đề hoặc slug đã tồn tại.' });
    }
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
    console.error('Lỗi khi xóa lý thuyết:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID chủ đề lý thuyết không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa chủ đề lý thuyết.' });
  }
};

// Export tất cả các hàm sau khi chúng đã được định nghĩa
module.exports = {
  getTheoryTopics,
  getTheoryBySlug,
  getTheoryById, // Đảm bảo export hàm này
  createTheory,
  updateTheory,
  deleteTheory,
};
