// frontend/pages/admin/users/index.js
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; 

const AdminUsersListPage = () => {
  const { token, user: currentUser } = useAuth(); // Lấy token và user hiện tại
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null); // Thông báo lỗi khi xóa

  // Hàm fetch danh sách người dùng
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Không có token xác thực. Vui lòng đăng nhập lại.');
      return;
    }

    setLoading(true);
    setError(null);
    setDeleteStatus(null); 
    setDeleteErrorMessage(null); // Reset lỗi xóa

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi tải danh sách người dùng.');
      }
      setUsers(data);
    } catch (err) {
      console.error('Lỗi khi tải người dùng:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); 

  // Xử lý xóa người dùng
  const handleDeleteClick = (userId) => {
    // Ngăn admin tự xóa tài khoản của chính mình
    if (currentUser && currentUser._id === userId) {
      setDeleteErrorMessage('Bạn không thể xóa tài khoản của chính mình.');
      return;
    }
    setUserToDeleteId(userId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDeleteId || !token) return;

    setShowDeleteConfirmModal(false);
    setLoading(true); 
    setDeleteStatus(null);
    setError(null);
    setDeleteErrorMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi xóa người dùng.');
      }

      setDeleteStatus('Người dùng đã được xóa thành công!');
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDeleteId));
      setUserToDeleteId(null);
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      setDeleteErrorMessage(`Lỗi xóa: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDeleteId(null);
    setDeleteErrorMessage(null); // Xóa lỗi khi hủy
  };


  return (
    <>
      <Head>
        <title>Quản lý Người dùng - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h2>
          {/* Không có nút thêm người dùng mới ở đây (đăng ký là tự do) */}
        </div>

        {loading && <div className="text-center p-4">Đang tải danh sách người dùng...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {deleteStatus && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{deleteStatus}</div>}
        {deleteErrorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{deleteErrorMessage}</div>} {/* Hiển thị lỗi xóa */}

        {!loading && !error && users.length === 0 && (
          <div className="text-center p-4 text-gray-600">Chưa có người dùng nào.</div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tên</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Vai trò</th>
                  <th className="py-3 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold">{user.name}</div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {/* THAY ĐỔI: Thêm Link đến trang chỉnh sửa */}
                        <Link href={`/admin/users/edit/${user._id}`}>
                          <a
                            className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200"
                            title="Sửa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className={`w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors duration-200 ${
                            currentUser && currentUser._id === user._id ? 'opacity-50 cursor-not-allowed' : '' // Vô hiệu hóa nút nếu là tài khoản hiện tại
                          }`}
                          title={currentUser && currentUser._id === user._id ? 'Không thể xóa tài khoản của chính mình' : 'Xóa'}
                          disabled={currentUser && currentUser._id === user._id} // Vô hiệu hóa nút
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

      {/* Modal xác nhận xóa */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận Xóa Người dùng</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.</p>
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

export default AdminUsersListPage;
