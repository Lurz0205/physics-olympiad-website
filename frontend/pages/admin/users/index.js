// frontend/pages/admin/users/index.js
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; // Để lấy token

const AdminUsersListPage = () => {
  const { token } = useAuth(); // Lấy token từ AuthContext
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State cho modal chỉnh sửa
  const [editingUser, setEditingUser] = useState(null); // State lưu user đang chỉnh sửa

  // Hàm fetch danh sách người dùng
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Không có token xác thực. Vui lòng đăng nhập lại.');
      return;
    }

    setLoading(true);
    setError(null);
    setDeleteStatus(null); // Reset trạng thái xóa

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
  }, [fetchUsers]); // Fetch lại khi fetchUsers thay đổi

  // Xử lý xóa người dùng
  const handleDeleteClick = (userId) => {
    setUserToDeleteId(userId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDeleteId || !token) return;

    setShowDeleteConfirmModal(false);
    setLoading(true); // Có thể muốn loading chỉ cho phần tử bị xóa, nhưng tạm thời loading toàn trang
    setDeleteStatus(null);
    setError(null);

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
      setDeleteStatus(`Lỗi xóa: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDeleteId(null);
  };

  // Xử lý chỉnh sửa người dùng (mở modal)
  const handleEditClick = (user) => {
    setEditingUser({ ...user }); // Tạo bản sao để chỉnh sửa
    setShowEditModal(true);
  };

  // Cập nhật người dùng (sau khi submit modal)
  const handleUpdateUser = async (updatedUserData) => {
    if (!editingUser || !token) return;

    setShowEditModal(false);
    setLoading(true); // Hiển thị loading
    setError(null);
    setDeleteStatus(null); // Dùng deleteStatus để hiển thị thông báo chung

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUserData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi cập nhật người dùng.');
      }

      setDeleteStatus('Người dùng đã được cập nhật thành công!');
      // Cập nhật danh sách người dùng hiển thị
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === editingUser._id ? { ...user, ...data } : user // Cập nhật user đã chỉnh sửa
      ));
      setEditingUser(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật người dùng:', err);
      setError(`Lỗi cập nhật: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
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
                        <button
                          onClick={() => handleEditClick(user)}
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200"
                          title="Sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
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

      {/* Modal chỉnh sửa người dùng */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Chỉnh sửa Người dùng</h3>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await handleUpdateUser({ 
                  name: e.target.name.value, 
                  email: e.target.email.value, 
                  role: e.target.role.value 
                });
              }}>
              <div className="mb-4">
                <label htmlFor="editName" className="block text-gray-700 text-sm font-bold mb-2">Tên:</label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  defaultValue={editingUser.name}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  defaultValue={editingUser.email}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="editRole" className="block text-gray-700 text-sm font-bold mb-2">Vai trò:</label>
                <select
                  id="editRole"
                  name="role"
                  defaultValue={editingUser.role}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersListPage;
