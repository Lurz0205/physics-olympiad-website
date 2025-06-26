// physics-olympiad-website/frontend/pages/theory/[slug].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link'; // Import Link
import { useAuth } from '../../context/AuthContext';
import MathContent from '../../components/MathContent';

const TheoryDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { token } = useAuth();

  const [theory, setTheory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheory = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/slug/${slug}`); 
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải nội dung lý thuyết.');
        }

        setTheory(data);
      } catch (err) {
        console.error('Error fetching theory detail:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải nội dung lý thuyết.');
      } finally {
        setLoading(false);
      }
    };

    fetchTheory();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Đang tải nội dung lý thuyết...</p>
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

  if (!theory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <p className="text-xl text-gray-600 text-center">Không tìm thấy bài lý thuyết này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Head>
        <title>{theory.title} - Lý thuyết</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        {/* Nút Quay về */}
        <div className="mb-6"> {/* Thêm khoảng cách dưới nút */}
          <Link href="/theory"> {/* Thay đổi đường dẫn đến trang danh sách lý thuyết chung */}
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              {/* Sử dụng icon mũi tên từ Lucide React nếu đã cài đặt, hoặc đơn giản là text */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Quay về Danh sách Lý thuyết
            </a>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">{theory.title}</h1>
        <p className="text-gray-600 text-lg mb-6 text-center">{theory.description}</p>
        
        <MathContent content={theory.content} />
      </div>
    </div>
  );
};

export default TheoryDetailPage;
