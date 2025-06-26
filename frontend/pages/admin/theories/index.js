// physics-olympiad-website/frontend/pages/admin/theories/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import AdminLayout from '../../../components/AdminLayout';

const AdminTheoriesPage = () => {
  const { token } = useAuth();
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(''); // Để hiển thị thông báo xóa

  useEffect(() => {
    fetchTheories();
  }, [token]); // Fetch lại khi token thay đổi (đăng nhập/đăng xuất)

  const fetchTheories = async () => {
    if (!token) {
      setLoading(false);
      setError('Không có quyền truy cập. Vui lòng đăng nhập.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tải danh sách lý thuyết.');
      }

      const data = await response.json();
      setTheories(data);
    } catch (err) {
      console.error('Error fetching theories:', err);
      setError('Đã xảy ra lỗi khi tải danh sách lý thuyết: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (theoryId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài lý thuyết này?')) { // Sử dụng confirm tạm thời
      return;
    }
    setDeleteStatus('Đang xóa...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${theoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa bài lý thuyết.');
      }

      setDeleteStatus('Xóa thành công!');
      fetchTheories(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      console.error('Error deleting theory:', err);
      setDeleteStatus('Lỗi khi xóa: ' + err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center p-6">Đang tải danh sách lý thuyết...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-6">Lỗi: {error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Quản lý Lý thuyết - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Lý thuyết</h2>
          <Link href="/admin/theories/new">
            <a className="btn-primary">Thêm Lý thuyết Mới</a>
          </Link>
        </div>

        {deleteStatus && (
          <div className={`p-3 rounded-md mb-4 ${deleteStatus.startsWith('Lỗi') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {deleteStatus}
          </div>
        )}

        {theories.length === 0 ? (
          <p className="text-gray-600 text-center">Chưa có bài lý thuyết nào. Hãy thêm mới!</p>
        ) : (
          <div className="overflow-x-auto"> {/* Thêm overflow cho bảng trên mobile */}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tiêu đề</th>
                  <th className="py-3 px-6 text-left">Slug</th>
                  <th className="py-3 px-6 text-left">Danh mục</th>
                  <th className="py-3 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {theories.map((theory) => (
                  <tr key={theory._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <Link href={`/theory/${theory.slug}`}>
                        <a className="text-blue-600 hover:underline">{theory.title}</a>
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-left">{theory.slug}</td>
                    <td className="py-3 px-6 text-left">{theory.category}</td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <Link href={`/admin/theories/edit/${theory._id}`}>
                        <a className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-xs mr-2 transition-colors duration-200">
                          Sửa
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDelete(theory._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-200"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTheoriesPage;
