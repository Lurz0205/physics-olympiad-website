// physics-olympiad-website/frontend/pages/admin/users/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy ID người dùng từ URL
  const { token, user: currentUser } = useAuth(); // Lấy token và user hiện tại (admin)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Mặc định là 'user'
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu ID của người dùng đang đăng nhập

  const [loading, setLoading] = useState(true); // Loading khi tải dữ liệu người dùng
  const [submitting, setSubmitting] = useState(false); // Loading khi submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Lấy ID của người dùng đang đăng nhập để kiểm tra xem có phải đang chỉnh sửa chính mình không
  useEffect(() => {
    if (currentUser) {
      setCurrentUserId(currentUser._id);
    }
  }, [currentUser]);

  // Hàm tải dữ liệu người dùng khi ID và token có sẵn
  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải dữ liệu người dùng.');
        }

        // Điền dữ liệu vào state
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);

      } catch (err) {
        console.error('Lỗi khi tải người dùng:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]); // Chạy lại khi ID hoặc token thay đổi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    // Client-side validation
    if (!name.trim() || !email.trim() || !role.trim()) {
      setError('Vui lòng điền đầy đủ Tên, Email và Vai trò.');
      setSubmitting(false);
      return;
    }

    // Kiểm tra để ngăn admin tự hạ cấp vai trò của chính mình
    if (id === currentUserId && role !== 'admin') {
      setError('Bạn không thể hạ cấp vai trò của chính mình.');
      setSubmitting(false);
      return;
    }

    try {
      const userData = {
        name,
        email,
        role,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
        method: 'PUT', // Dùng PUT để cập nhật
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error on updating user:', data);
        throw new Error(data.message || 'Lỗi khi cập nhật người dùng.');
      }

      setSuccess('Cập nhật người dùng thành công!');
      setTimeout(() => {
        router.push('/admin/users'); // Chuyển hướng về danh sách người dùng
      }, 2000);

    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        Lỗi: {error}
        <Link href="/admin/users">
            <a className="ml-4 text-blue-800 hover:underline">Quay lại danh sách</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chỉnh sửa Người dùng - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Chỉnh sửa Người dùng</h2>
          <Link href="/admin/users">
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
          {/* Tên */}
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Tên:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Vai trò */}
          <div>
            <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">Vai trò:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              // Vô hiệu hóa chọn vai trò nếu người dùng đang chỉnh sửa chính họ
              disabled={id === currentUserId} 
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            {id === currentUserId && (
              <p className="mt-1 text-xs text-gray-500">Bạn không thể thay đổi vai trò của chính mình.</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật...' : 'Cập nhật Người dùng'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditUserPage;
