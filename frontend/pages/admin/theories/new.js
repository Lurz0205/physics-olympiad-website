// physics-olympiad-website/frontend/pages/admin/theories/new.js
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link'; // Import Link

const NewTheoryPage = () => {
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('CƠ HỌC'); // Default category
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Các category có sẵn (phải khớp với enum trong backend/models/Theory.js)
  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    // Client-side validation
    if (!title.trim() || !slug.trim() || !description.trim() || !content.trim() || !category.trim()) {
      setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, slug, description, content, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi tạo bài lý thuyết.');
      }

      setSuccess('Tạo bài lý thuyết mới thành công!');
      // Có thể chuyển hướng về trang danh sách hoặc reset form
      router.push('/admin/theories');
    } catch (err) {
      console.error('Error creating theory:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tự động tạo slug từ title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const generateSlug = (text) => {
    return text
      .normalize("NFD") // Chuyển đổi Unicode sang dạng chuẩn NFKD (tách chữ có dấu thành chữ không dấu và dấu)
      .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
      .toLowerCase() // Chuyển về chữ thường
      .trim() // Xóa khoảng trắng đầu cuối
      .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w-]+/g, '') // Xóa tất cả các ký tự không phải chữ, số, hoặc gạch ngang
      .replace(/--+/g, '-'); // Thay thế nhiều dấu gạch ngang thành một
  };


  return (
    <AdminLayout>
      <Head>
        <title>Thêm Lý thuyết Mới - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Thêm Lý thuyết Mới</h2>
            <Link href="/admin/theories">
                <a className="btn-secondary">Quay lại Danh sách</a>
            </Link>
        </div>

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
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Tiêu đề:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange} // Sử dụng hàm mới để tự động tạo slug
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-gray-700 text-sm font-medium mb-2">Slug:</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              readOnly // Tùy chọn: chỉ đọc nếu bạn muốn slug được tạo tự động
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Mô tả:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700 text-sm font-medium mb-2">Nội dung (hỗ trợ Markdown & LaTeX):</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="w-full p-3 font-mono border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            ></textarea>
          </div>
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
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo Bài Lý thuyết'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewTheoryPage;
