// physics-olympiad-website/frontend/pages/admin/tests/index.js
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';

const AdminTestsPage = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const fetchExams = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // THAY ĐỔI: Đảm bảo gọi API /api/exams (admin endpoint)
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
  }, [fetchExams, router.asPath]);

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
      fetchExams();
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

  if (!user || user.role !== 'admin') {
    return null;
  }

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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.title}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/tests/edit/${exam._id}`}>
                        <a className="text-indigo-600 hover:text-indigo-900 mr-3 p-2 rounded-full hover:bg-indigo-50 transition duration-150" title="Chỉnh sửa">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-7.664 7.664a1 1 0 01-.328.232l-3 1a1 1 0 01-1.264-1.264l1-3a1 1 0 01.232-.328l7.664-7.664zM16 17v-1.586l-7.664-7.664-2.828 2.828 7.664 7.664H16z" />
                          </svg>
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(exam._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
                        title="Xóa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận Xóa</h3>
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
