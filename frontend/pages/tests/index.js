// frontend/pages/tests/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const TestListPage = () => {
  const { user, token, authLoading } = useAuth();
  const [tests, setTests] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false); // Đã thay đổi: ban đầu không loading
  const [error, setError] = useState(null);
  const [groupedTests, setGroupedTests] = useState({});

  useEffect(() => {
    // Nếu AuthProvider đang xác thực, đợi nó xong
    if (authLoading) {
      return;
    }

    // Nếu AuthProvider đã xong và không có user, hiển thị lỗi
    if (!user) {
      setError('Bạn cần đăng nhập để xem các đề thi.');
      return;
    }

    // Khi user đã có, bắt đầu fetch dữ liệu
    const fetchTests = async () => {
      setLoadingContent(true); // Bắt đầu loading khi fetch dữ liệu
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
          }
          throw new Error(data.message || 'Lỗi khi tải danh sách đề thi.');
        }
        setTests(data);

        const grouped = data.reduce((acc, test) => {
          const category = test.category || 'Chưa phân loại';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(test);
          return acc;
        }, {});
        setGroupedTests(grouped);

      } catch (err) {
        console.error('Lỗi khi tải đề thi:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải đề thi.');
      } finally {
        setLoadingContent(false); // Kết thúc loading
      }
    };

    fetchTests();
  }, [user, token, authLoading]);

  // Nếu authLoading đã xong nhưng không có user
  if (!user && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Bạn cần đăng nhập để xem các đề thi.</p>
        <Link href="/login">
          <a className="mt-4 btn-primary">Đăng nhập ngay</a>
        </Link>
      </div>
    );
  }

  // Hiển thị lỗi fetch nếu có
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">{error}</p>
        <Link href="/login">
          <a className="mt-4 btn-primary">Đăng nhập lại</a>
        </Link>
      </div>
    );
  }

  const categoryOrder = ['ĐỀ THI HSG', 'ĐỀ THI THỬ ĐẠI HỌC', 'ĐỀ THI CHUYÊN', 'ĐỀ KIỂM TRA', 'Chưa phân loại'];
  const sortedCategories = Object.keys(groupedTests).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Head>
        <title>Đề thi Online - HTB</title>
        <meta name="description" content="Tổng hợp các đề thi Vật lý online theo các kỳ thi khác nhau." />
      </Head>

      <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Hệ thống Đề thi Online</h1>
        <p className="text-gray-700 text-lg mb-8 text-center">
          Tổng hợp các đề thi Vật lý THPT từ các kỳ thi Học sinh giỏi, thi thử Đại học và đề thi kiểm tra.
        </p>

        {loadingContent ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">Đang tải danh sách đề thi...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="p-6 text-gray-600 bg-gray-50 rounded-lg shadow-inner text-center">
            <p className="text-xl">Hiện chưa có đề thi nào được thêm vào hệ thống.</p>
            <p className="text-sm mt-2">Hãy kiểm tra lại sau hoặc liên hệ quản trị viên để biết thêm chi tiết.</p>
          </div>
        ) : (
          sortedCategories.map(category => (
            <section key={category} className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTests[category].map(test => (
                  <div key={test._id} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 transform hover:scale-102 transition-transform duration-200 ease-in-out cursor-pointer">
                    <Link href={`/tests/${test.slug}`}>
                      <a>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">{test.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{test.description}</p>
                        <div className="flex flex-wrap justify-between items-center text-xs mt-3 gap-2">
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{test.category}</span>
                          <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                            {test.duration} phút
                          </span>
                          {test.isPublished ? (
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Đã xuất bản
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              Chưa xuất bản
                            </span>
                          )}
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default TestListPage;
