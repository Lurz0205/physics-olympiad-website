import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

const TestsPage = () => {
  const { token, loading: authLoading } = useAuth();
  const [testIds, setTestIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && token) {
      const fetchTestIds = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/test-ids`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setTestIds(data);
          } else {
            setError(data.message || 'Không thể tải danh sách đề thi.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy danh sách đề thi:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchTestIds();
    } else if (!authLoading && !token) {
      setLoading(false);
      setError('Vui lòng đăng nhập để xem các đề thi online.');
    }
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="text-center text-primary text-xl mt-16">Đang tải danh sách đề thi...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-16">{error}</div>;
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl text-center mt-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Truy cập bị từ chối</h2>
        <p className="text-lg text-gray-700 mb-6">
          Bạn cần đăng nhập để xem và làm các đề thi online.
        </p>
        <Link href="/login" className="bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Đề thi Online - Vật lý HSG</title>
      </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl mt-8">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Các Đề thi Online</h1>
        {testIds.length === 0 ? (
          <p className="text-gray-600 text-center">Chưa có đề thi nào được thêm. Vui lòng quay lại sau!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testIds.map((id) => (
              <Link key={id} href={`/tests/${id}`} className="block bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">{id.replace(/_/g, ' ')}</h2>
                <p className="text-blue-700">Luyện tập đề thi: {id}</p>
                <p className="text-sm text-gray-500 mt-2">Nhấn để bắt đầu làm bài.</p>
              </Link>
            ))}
          </div>
        )}
        <h2 className="text-3xl font-bold text-primary mt-12 mb-6 text-center">Lịch sử bài làm của tôi</h2>
        <UserTestResults userId={user ? user._id : null} />
      </div>
    </>
  );
};

// Component để hiển thị lịch sử bài làm của người dùng
const UserTestResults = () => {
  const { token, loading: authLoading } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && token) {
      const fetchResults = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/test-results/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setResults(data);
          } else {
            setError(data.message || 'Không thể tải lịch sử bài làm.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy lịch sử bài làm:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else if (!authLoading && !token) {
      setLoading(false);
    }
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="text-center text-primary text-md mt-4">Đang tải lịch sử bài làm...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-md mt-4">{error}</div>;
  }

  if (results.length === 0) {
    return <p className="text-gray-600 text-center mt-4">Bạn chưa làm bài kiểm tra nào.</p>;
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đề thi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điểm số
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian làm
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời điểm nộp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((res) => (
              <tr key={res._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {res.testId.replace(/_/g, ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {res.score} / {res.totalQuestions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {res.timeTakenSeconds ? `${Math.floor(res.timeTakenSeconds / 60)}p ${res.timeTakenSeconds % 60}s` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(res.submittedAt).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default TestsPage;
