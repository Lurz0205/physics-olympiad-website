// physics-olympiad-website/frontend/pages/admin/theories/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';
// XÓA DÒNG NÀY: import AdminLayout from '../../../../components/AdminLayout';
import Link from 'next/link';

const EditTheoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('CƠ HỌC');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];

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
    setSlug(generateSlug(newTitle));
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

  if (loading) {
    return (
      <AdminLayout> {/* Giữ AdminLayout ở đây cho trạng thái loading/error ban đầu */}
        <div className="text-center p-6">Đang tải dữ liệu lý thuyết...</div>
      </AdminLayout>
    );
  }

  if (error && !success) {
    return (
      <AdminLayout> {/* Giữ AdminLayout ở đây cho trạng thái loading/error ban đầu */}
        <div className="text-center text-red-600 p-6">Lỗi: {error}</div>
        <div className="flex justify-center mt-4">
            <Link href="/admin/theories">
                <a className="btn-secondary">Quay lại Danh sách</a>
            </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    // THAY ĐỔI: Dùng Fragment <> </> thay vì AdminLayout
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
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              readOnly
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
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật...' : 'Cập nhật Bài Lý thuyết'}
          </button>
        </form>
      </div>
    </> // THAY ĐỔI: Dùng Fragment
  );
};

export default EditTheoryPage;
