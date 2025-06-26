// physics-olympiad-website/frontend/pages/admin/theories/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

const AdminTheoriesListPage = () => {
  const { token, user } = useAuth();
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  useEffect(() => {
    const fetchTheories = async () => {
      if (!token) {
        setLoading(false);
        setError('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản Admin.');
        return;
      }

      setLoading(true);
      setError(null);
      setDeleteStatus(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải danh sách lý thuyết.');
        }
        setTheories(data);
      } catch (err) {
        console.error('Error fetching theories:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải danh sách lý thuyết.');
      } finally {
        setLoading(false);
      }
    };

    fetchTheories();
  }, [token, deleteStatus]);

  const handleDelete = async (theoryId) => {
    const confirmation = window.confirm('Bạn có chắc chắn muốn xóa bài lý thuyết này?');
    if (!confirmation) {
      return;
    }

    setDeleteStatus(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${theoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi xóa bài lý thuyết.');
      }

      setDeleteStatus('Bài lý thuyết đã được xóa thành công!');
      setTheories(prevTheories => prevTheories.filter(th => th._id !== theoryId)); 

    } catch (err) {
      console.error('Error deleting theory:', err);
      setDeleteStatus(`Lỗi xóa: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
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

        {loading && <div className="text-center p-4">Đang tải danh sách lý thuyết...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {deleteStatus && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{deleteStatus}</div>}

        {!loading && !error && theories.length === 0 && (
          <div className="text-center p-4 text-gray-600">Chưa có bài lý thuyết nào. Hãy thêm bài lý thuyết mới!</div>
        )}

        {!loading && !error && theories.length > 0 && (
          <div className="overflow-x-auto">
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
                      {/* THAY ĐỔI: Thêm Link đến trang chi tiết lý thuyết */}
                      <Link href={`/theory/${theory.slug}`}>
                        <a className="font-semibold text-blue-600 hover:underline">
                          {theory.title}
                        </a>
                      </Link>
                      {/* Có thể thêm mô tả ngắn nếu muốn */}
                      {/* <div className="text-gray-500 text-xs line-clamp-1">{theory.description}</div> */}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-500 text-xs">{theory.slug}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {theory.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <Link href={`/admin/theories/edit/${theory._id}`}>
                          <a className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDelete(theory._id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors duration-200"
                          title="Xóa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTheoriesListPage;
