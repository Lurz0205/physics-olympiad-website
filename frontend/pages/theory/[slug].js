// physics-olympiad-website/frontend/pages/theory/[slug].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext'; // Import useAuth nếu bạn muốn kiểm tra trạng thái đăng nhập

const TheoryDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query; // Lấy slug từ URL
  const { token } = useAuth(); // Lấy token để xác thực nếu API cần (ở đây không cần cho getBySlug public)

  const [theory, setTheory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheory = async () => {
      if (!slug) { // Đảm bảo slug đã có trước khi fetch
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // THAY ĐỔI QUAN TRỌNG: Gọi đúng API theo slug
        // Không cần Authorization header nếu API /api/theory/slug/:slug là public
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
  }, [slug]); // Effect chạy khi slug thay đổi

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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">{theory.title}</h1>
        <p className="text-gray-600 text-lg mb-6 text-center">{theory.description}</p>
        
        {/* Render nội dung lý thuyết */}
        <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: theory.content }}>
          {/* dangerouslySetInnerHTML được sử dụng để render HTML từ Markdown/LaTeX đã được xử lý */}
        </div>
      </div>
    </div>
  );
};

export default TheoryDetailPage;
