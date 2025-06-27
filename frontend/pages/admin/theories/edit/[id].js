// physics-olympiad-website/frontend/pages/admin/theories/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';
import Link from 'next/link';

const EditTheoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [originalSlug, setOriginalSlug] = useState(''); // Để so sánh khi tự động tạo slug
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('CƠ HỌC');
  const [loading, setLoading] = useState(true); // Loading khi tải dữ liệu lý thuyết
  const [submitting, setSubmitting] = useState(false); // Loading khi submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];

  // LOẠI BỎ: Logic kiểm tra user.role trùng lặp (AdminLayout đã xử lý)
  // useEffect(() => {
  //   if (user && user.role !== 'admin') {
  //     router.push('/login'); // Hoặc trang lỗi
  //   }
  // }, [user, router]);

  useEffect(() => {
    const fetchTheory = async () => {
      if (!id || !token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải dữ liệu lý thuyết.');
        }
        setTitle(data.title);
        setSlug(data.slug);
        setOriginalSlug(data.slug); // Lưu slug ban đầu
        setDescription(data.description);
        setContent(data.content);
        setCategory(data.category);
      } catch (err) {
        console.error('Error fetching theory:', err);
        setError(err.message || 'Không tìm thấy bài lý thuyết hoặc lỗi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchTheory();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    if (!title.trim() || !slug.trim() || !description.trim() || !content.trim() || !category.trim()) {
      setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, slug, description, content, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi cập nhật bài lý thuyết.');
      }

      setSuccess('Cập nhật bài lý thuyết thành công!');
      // Tùy chọn: chuyển hướng về danh sách lý thuyết sau một thời gian
      setTimeout(() => {
        router.push('/admin/theories');
      }, 2000);

    } catch (err) {
      console.error('Error updating theory:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Chỉ tự động cập nhật slug nếu slug hiện tại chưa được chỉnh sửa thủ công
    // hoặc nếu nó trùng với slug ban đầu được tạo từ tiêu đề
    if (slug === originalSlug || !slug) { // Nếu slug rỗng hoặc vẫn là slug gốc của tiêu đề
      setSlug(generateSlug(newTitle));
    }
  };

  const generateSlug = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  // Cải thiện hiển thị loading khi tải dữ liệu ban đầu
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải dữ liệu lý thuyết...</p>
        </div>
      </div>
    );
  }

  // Cải thiện hiển thị lỗi tải dữ liệu
  if (error && !submitting) { 
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        Lỗi: {error}
        <Link href="/admin/theories">
            <a className="ml-4 text-blue-800 hover:underline">Quay lại danh sách</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chỉnh sửa Lý thuyết - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Chỉnh sửa Lý thuyết</h2>
            <Link href="/admin/theories">
                <a className="btn-secondary">Quay lại Danh sách</a>
            </Link>
        </div>

        {error && submitting && (
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
              onChange={handleTitleChange}
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
              onChange={(e) => setSlug(e.target.value)} // Bỏ readOnly để cho phép sửa thủ công
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Slug sẽ tự động tạo từ tiêu đề hoặc có thể chỉnh sửa thủ công.</p>
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
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật...' : 'Cập nhật Bài Lý thuyết'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditTheoryPage;
