// physics-olympiad-website/frontend/pages/admin/theories/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; // Vẫn giữ để lấy token

const AdminTheoriesListPage = () => {
  const { token } = useAuth(); // Chỉ cần token để gọi API
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // THAY ĐỔI: Thêm state cho modal
  const [theoryToDelete, setTheoryToDelete] = useState(null); // THAY ĐỔI: Thêm state lưu ID cần xóa

  useEffect(() => {
    const fetchTheories = async () => {
      // AdminLayout đã kiểm tra token và quyền admin, nên chỉ cần kiểm tra token có tồn tại
      if (!token) {
        setLoading(false);
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
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
  }, [token, deleteStatus]); // Reruns when token or deleteStatus changes

  // THAY ĐỔI MỚI: Hàm xử lý click xóa để mở modal
  const handleDeleteClick = (theoryId) => {
    setTheoryToDelete(theoryId);
    setShowConfirmModal(true);
  };

  // THAY ĐỔI MỚI: Hàm xác nhận xóa
  const confirmDelete = async () => {
    if (!theoryToDelete || !token) return; // Đảm bảo có ID để xóa và token

    setShowConfirmModal(false); // Đóng modal
    setLoading(true); // Hiển thị loading trong khi xóa
    setError(null);
    setDeleteStatus(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${theoryToDelete}`, {
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
      // Cập nhật state để xóa bài lý thuyết khỏi danh sách hiển thị
      setTheories(prevTheories => prevTheories.filter(th => th._id !== theoryToDelete));
      setTheoryToDelete(null); // Reset ID
    } catch (err) {
      console.error('Error deleting theory:', err);
      setDeleteStatus(`Lỗi xóa: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // THAY ĐỔI MỚI: Hàm hủy xóa
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setTheoryToDelete(null);
  };

  // Loại bỏ hoàn toàn logic kiểm tra user.role ở đây, AdminLayout đã xử lý
  // if (!user || user.role !== 'admin') { return null; }

  return (
    <>
      <Head>
        <title>Quản lý Lý thuyết - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Lý thuyết</h2>
          {/* THAY ĐỔI LINK: đảm bảo khớp với AdminLayout.js */}
          <Link href="/admin/theory/new">
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
                      <Link href={`/theory/${theory.slug}`}>
                        <a className="font-semibold text-blue-600 hover:underline">
                          {theory.title}
                        </a>
                      </Link>
                      <div className="text-gray-500 text-xs">{theory.slug}</div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-500 text-xs">{theory.category}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {theory.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {/* THAY ĐỔI LINK: đảm bảo khớp với AdminLayout.js */}
                        <Link href={`/admin/theory/edit/${theory._id}`}>
                          <a className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(theory._id)} // THAY ĐỔI: Gọi hàm mở modal
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

      {/* THAY ĐỔI MỚI: Modal xác nhận xóa */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận Xóa Lý thuyết</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa bài lý thuyết này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTheoriesListPage;
