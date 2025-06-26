// physics-olympiad-website/frontend/pages/theory/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';
import MathContent from '../../components/MathContent';

const TheoryDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { token, loading: authLoading } = useAuth();
  const [theory, setTheory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug && !authLoading) {
      if (!token) {
        setLoading(false);
        setError('Vui lòng đăng nhập để xem nội dung này.');
        return;
      }

      const fetchTheory = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory/${slug}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setTheory(data);
          } else {
            setError(data.message || 'Không tìm thấy nội dung lý thuyết.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy chi tiết lý thuyết:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchTheory();
    }
  }, [slug, token, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white"> {/* Nền trắng */}
        <p className="text-xl text-gray-700">Đang tải nội dung...</p>
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

  if (!theory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white"> {/* Nền trắng */}
        <p className="text-xl text-gray-700">Không tìm thấy nội dung lý thuyết.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8"> {/* Nền hơi xám nhạt */}
      <Head>
        <title>{theory.title} - Lý thuyết Vật lý HSG</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"> {/* Tăng bo tròn, shadow, thêm border */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{theory.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{theory.description}</p>
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          <MathContent content={theory.content} />
        </div>
        <Link
          href="/theory"
          className="mt-8 inline-block bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition duration-300 shadow-md transform hover:scale-105" // Nút bo tròn, hiệu ứng
        >
          &larr; Quay lại
        </Link>
      </div>
    </div>
  );
};

export default TheoryDetail;
