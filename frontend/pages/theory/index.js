// physics-olympiad-website/frontend/pages/theory/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

const TheoryTopicsPage = () => {
  const { user, token: authToken } = useAuth();
  const [groupedTopics, setGroupedTopics] = useState({}); // State để lưu các chủ đề đã nhóm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!user || !authToken) {
        setError('Bạn cần đăng nhập để xem các chủ đề lý thuyết.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi lấy chủ đề lý thuyết.');
        }

        const data = await response.json();
        // Nhóm các chủ đề theo category
        const categories = {};
        data.forEach(topic => {
          const categoryName = topic.category || 'Chưa phân loại'; // Nếu backend chưa có category
          if (!categories[categoryName]) {
            categories[categoryName] = [];
          }
          categories[categoryName].push(topic);
        });
        setGroupedTopics(categories);
      } catch (err) {
        console.error('Lỗi fetch topics:', err);
        setError('Đã xảy ra lỗi khi kết nối máy chủ: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [user, authToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Đang tải chủ đề lý thuyết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <p className="text-xl text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const categoryNames = Object.keys(groupedTopics).sort(); // Lấy tên các category và sắp xếp

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Head>
        <title>Chủ đề Lý thuyết - Olympic Vật lý</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Các Chủ đề Lý thuyết</h1>
        
        {categoryNames.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Chưa có chủ đề lý thuyết nào được đăng tải.</p>
        ) : (
          <div className="space-y-8"> {/* Thêm khoảng cách giữa các nhóm category */}
            {categoryNames.map(categoryName => (
              <div key={categoryName} className="bg-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-3">
                  {categoryName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {groupedTopics[categoryName].map((topic) => (
                    <Link key={topic.slug} href={`/theory/${topic.slug}`}>
                      <a className="block h-full flex flex-col justify-between bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-200">
                        <div>
                          <h3 className="text-xl font-semibold text-blue-700 mb-2">{topic.title}</h3>
                          <p className="text-gray-700 text-sm">{topic.description}</p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheoryTopicsPage;
