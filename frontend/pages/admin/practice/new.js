// physics-olympiad-website/frontend/pages/admin/practice/new.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';

const AddNewExercisePage = () => {
  const router = useRouter();
  const { token } = useAuth(); // Lấy token để xác thực API

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState(''); // Slug sẽ tự động tạo từ tiêu đề
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState('CƠ HỌC'); // Giá trị mặc định
  const [difficulty, setDifficulty] = useState('Trung bình'); // Giá trị mặc định
  const [tags, setTags] = useState(''); // Chuỗi các tags, sẽ được chuyển đổi thành mảng

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];
  const difficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  // Hàm tạo slug từ tiêu đề
  const generateSlug = (text) => {
    return text
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .toLowerCase() // Chuyển thành chữ thường
      .trim() // Xóa khoảng trắng đầu cuối
      .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w-]+/g, '') // Loại bỏ ký tự không phải chữ, số, gạch ngang
      .replace(/--+/g, '-'); // Thay thế nhiều dấu gạch ngang bằng một
  };

  // Cập nhật tiêu đề và tự động tạo slug
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    // Client-side validation cơ bản
    if (!title.trim() || !slug.trim() || !problemStatement.trim() || !category.trim() || !difficulty.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đề bài, Danh mục, Độ khó).');
      setSubmitting(false);
      return;
    }

    try {
      const exerciseData = {
        title,
        slug,
        description: description.trim(), // Mô tả có thể rỗng
        problemStatement,
        solution: solution.trim(), // Lời giải có thể rỗng
        category,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Chuyển chuỗi tags thành mảng
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Gửi token để xác thực admin
        },
        body: JSON.stringify(exerciseData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log lỗi từ backend để debug
        console.error('Backend error on adding exercise:', data);
        throw new Error(data.message || 'Lỗi khi thêm bài tập.');
      }

      setSuccess('Thêm bài tập mới thành công!');
      // Reset form sau khi thêm thành công
      setTitle('');
      setSlug('');
      setDescription('');
      setProblemStatement('');
      setSolution('');
      setCategory('CƠ HỌC');
      setDifficulty('Trung bình');
      setTags('');

      // Tùy chọn: chuyển hướng về danh sách bài tập sau một thời gian
      setTimeout(() => {
        router.push('/admin/practice');
      }, 2000);

    } catch (err) {
      console.error('Error adding exercise:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <> {/* _app.js sẽ tự động bọc AdminLayout */}
      <Head>
        <title>Thêm Bài tập Mới - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Thêm Bài tập Mới</h2>
          <Link href="/admin/practice">
            <a className="btn-secondary">Quay lại Danh sách</a>
          </Link>
        </div>

        {/* Thông báo lỗi/thành công */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tiêu đề */}
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Tiêu đề Bài tập:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập tiêu đề bài tập"
              required
            />
          </div>

          {/* Slug (tự động tạo, chỉ đọc) */}
          <div>
            <label htmlFor="slug" className="block text-gray-700 text-sm font-medium mb-2">Slug:</label>
            <input
              type="text"
              id="slug"
              value={slug}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 cursor-not-allowed"
              readOnly
              required
            />
            <p className="mt-1 text-xs text-gray-500">Slug sẽ tự động tạo từ tiêu đề và dùng cho URL.</p>
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Mô tả ngắn gọn:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Mô tả ngắn gọn về bài tập (không bắt buộc)"
            ></textarea>
          </div>

          {/* Đề bài */}
          <div>
            <label htmlFor="problemStatement" className="block text-gray-700 text-sm font-medium mb-2">Đề bài (hỗ trợ Markdown & LaTeX):</label>
            <textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows="10"
              className="w-full p-3 font-mono border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập nội dung đề bài tại đây (sử dụng Markdown và LaTeX cho công thức toán)."
              required
            ></textarea>
          </div>

          {/* Lời giải */}
          <div>
            <label htmlFor="solution" className="block text-gray-700 text-sm font-medium mb-2">Lời giải chi tiết (hỗ trợ Markdown & LaTeX):</label>
            <textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows="10"
              className="w-full p-3 font-mono border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập lời giải chi tiết tại đây (không bắt buộc, sử dụng Markdown và LaTeX)."
            ></textarea>
          </div>

          {/* Danh mục */}
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-2">Danh mục:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Độ khó */}
          <div>
            <label htmlFor="difficulty" className="block text-gray-700 text-sm font-medium mb-2">Độ khó:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-gray-700 text-sm font-medium mb-2">Tags (phân cách bởi dấu phẩy):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ví dụ: Định luật Ohm, Mạch điện, Dòng điện xoay chiều"
            />
            <p className="mt-1 text-xs text-gray-500">Các thẻ giúp tìm kiếm và phân loại bài tập dễ dàng hơn.</p>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Đang thêm bài tập...' : 'Thêm Bài tập Mới'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewExercisePage;
