// physics-olympiad-website/frontend/pages/admin/tests/index.js
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; 

const AdminTestsPage = () => {
  const { token } = useAuth(); // Chỉ cần token để gọi API
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchExams = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi tải danh sách đề thi.');
      }
      setExams(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đề thi:', err);
      setError(err.message || 'Không thể tải danh sách đề thi.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDeleteClick = (examId) => {
    setDeletingId(examId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId || !token) return;

    setShowConfirmModal(false);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${deletingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Lỗi khi xóa đề thi.');
      }

      setSuccessMessage('Xóa đề thi thành công!');
      fetchExams(); // Gọi lại để cập nhật danh sách
    } catch (err) {
      console.error('Lỗi khi xóa đề thi:', err);
      setError(err.message || 'Đã xảy ra lỗi khi xóa đề thi.');
      setLoading(false);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeletingId(null);
  };

  return (
    <>
      <Head>
        <title>Quản lý Đề thi Online - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Đề thi Online</h2>
          <Link href="/admin/tests/new">
            <a className="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Thêm Đề thi Mới
            </a>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-lg text-gray-700">Đang tải đề thi...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">Chưa có đề thi nào được tạo.</p>
            <p className="text-gray-500 mt-2">Hãy nhấn "Thêm Đề thi Mới" để bắt đầu!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xuất bản
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam._id}>
                    {/* Tiêu đề có thể nhấp */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/tests/${exam.slug}`} passHref>
                        <a className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline">
                          {exam.title}
                        </a>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exam.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exam.duration} phút</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {exam.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {exam.isPublished ? (
                        <span className="text-green-600 font-bold">✔</span>
                      ) : (
                        <span className="text-red-600 font-bold">✖</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {/* BẮT ĐẦU THAY ĐỔI NÚT HÀNH ĐỘNG */}
                      <div className="flex item-center justify-center space-x-2"> {/* Thêm flex container để căn giữa và tạo khoảng cách */}
                        {/* Nút Chỉnh sửa */}
                        <Link href={`/admin/tests/edit/${exam._id}`}>
                          <a className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </a>
                        </Link>
                        {/* Nút Xóa */}
                        <button
                          onClick={() => handleDeleteClick(exam._id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors duration-200"
                          title="Xóa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {/* KẾT THÚC THAY ĐỔI NÚT HÀNH ĐỘNG */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận Xóa Đề thi</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác.</p>
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

export default AdminTestsPage;
