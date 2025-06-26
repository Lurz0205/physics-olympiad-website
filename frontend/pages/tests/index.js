// physics-olympiad-website/frontend/pages/tests/index.js
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext'; // Đã sửa đường dẫn
import Head from 'next/head';

const TestsPage = () => {
  const { user, authToken } = useContext(AuthContext); // Lấy user và authToken từ context
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      if (!user || !authToken) {
        setError('Bạn cần đăng nhập để xem các đề thi.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests`, { // Gọi API mới
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi lấy danh sách đề thi.');
        }

        const data = await response.json();
        setTests(data);
      } catch (err) {
        console.error('Lỗi fetch tests:', err);
        setError('Đã xảy ra lỗi khi kết nối máy chủ: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user, authToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải danh sách đề thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Head>
        <title>Đề thi Online - Olympic Vật lý</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Các Đề thi Online</h1>
        {tests.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Chưa có đề thi nào được đăng tải.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Link key={test.slug} href={`/tests/${test.slug}`}>
                <a className="block bg-green-50 hover:bg-green-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer">
                  <h2 className="text-xl font-semibold text-green-800 mb-2">{test.title}</h2>
                  <p className="text-gray-700 text-sm">{test.description}</p>
                  <p className="text-gray-600 text-xs mt-2">Thời lượng: {test.duration} phút</p>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsPage;
