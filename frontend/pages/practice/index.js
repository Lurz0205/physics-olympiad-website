// physics-olympiad-website/frontend/pages/practice/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

const PracticeTopicsPage = () => {
  const { user, token: authToken } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!user || !authToken) {
        setError('Bạn cần đăng nhập để xem các chủ đề bài tập.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/practice/topics`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi lấy chủ đề bài tập.');
        }

        const data = await response.json();
        setTopics(data);
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
      <div className="flex items-center justify-center min-h-screen bg-white"> {/* Nền trắng */}
        <p className="text-xl text-gray-700">Đang tải chủ đề bài tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4"> {/* Nền trắng */}
        <p className="text-xl text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8"> {/* Nền hơi xám nhạt */}
      <Head>
        <title>Chủ đề Bài tập - Olympic Vật lý</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"> {/* Tăng bo tròn, shadow, thêm border */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Các Chủ đề Bài tập</h1>
        {topics.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Chưa có chủ đề bài tập nào được đăng tải.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/practice/${topic.slug}`}>
                <a className="block bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-200"> {/* Nền trắng, bo tròn, shadow, border */}
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">{topic.title}</h2> {/* Màu chữ xanh đậm hơn */}
                  <p className="text-gray-700 text-sm">{topic.description}</p>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTopicsPage;
