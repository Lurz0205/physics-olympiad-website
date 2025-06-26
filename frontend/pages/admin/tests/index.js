// physics-olympiad-website/frontend/pages/admin/tests/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';

const AdminExamsListPage = () => {
  const { token, user } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  // Chuyển hướng nếu không phải admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login'); // Hoặc trang lỗi
    }
  }, [user, router]);

  useEffect(() => {
    const fetchExams = async () => {
      if (!token) {
        setLoading(false);
        setError('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản Admin.');
        return;
      }

      setLoading(true);
      setError(null);
      setDeleteStatus(null); // Reset trạng thái xóa khi tải lại danh sách

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Admin cần token để lấy tất cả đề thi
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải danh sách đề thi.');
        }
        setExams(data);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token, deleteStatus]); // Thêm deleteStatus vào dependency để refresh sau khi xóa

  const handleDelete = async (examId) => {
    const confirmation = window.confirm('Bạn có chắc chắn muốn xóa đề thi này?');
    if (!confirmation) {
      return;
    }

    setDeleteStatus(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi xóa đề thi.');
      }

      setDeleteStatus('Đề thi đã được xóa thành công!');
      // Tối ưu: Lọc bỏ đề thi đã xóa khỏi state thay vì fetch lại toàn bộ
      setExams(prevExams => prevExams.filter(exam => exam._id !== examId)); 

    } catch (err) {
      console.error('Error deleting exam:', err);
      setDeleteStatus(`Lỗi xóa: ${err.message || 'Đã xảy ra lỗi không xác định.'}`);
    }
  };

  // Nếu không phải admin hoặc chưa có token, sẽ tự động chuyển hướng bởi AdminLayout (hoặc useEffect trên)
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
          <Link href="/admin/tests/new"> {/* Link tới trang thêm đề thi mới */}
            <a className="btn-primary">Thêm Đề thi Mới</a>
          </Link>
        </div>

        {loading && <div className="text-center p-4">Đang tải danh sách đề thi...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {deleteStatus && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{deleteStatus}</div>}

        {!loading && !error && exams.length === 0 && (
          <div className="text-center p-4 text-gray-600">Chưa có đề thi nào. Hãy thêm đề thi mới!</div>
        )}

        {!loading && !error && exams.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tiêu đề</th>
                  <th className="py-3 px-6 text-left">Slug</th>
                  <th className="py-3 px-6 text-center">Thời gian</th>
                  <th className="py-3 px-6 text-center">Xuất bản</th>
                  <th className="py-3 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {exams.map((exam) => (
                  <tr key={exam._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {/* Link đến trang chi tiết đề thi công khai */}
                      <Link href={`/tests/${exam.slug}`}>
                        <a className="font-semibold text-blue-600 hover:underline">
                          {exam.title}
                        </a>
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-500 text-xs">{exam.slug}</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="py-1 px-3 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                        {exam.duration} phút
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        exam.isPublished ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {exam.isPublished ? 'Đã XB' : 'Chưa XB'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <Link href={`/admin/tests/edit/${exam._id}`}>
                          <a className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDelete(exam._id)}
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

export default AdminExamsListPage;
