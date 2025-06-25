import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

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
    return <div className="text-center text-primary text-xl mt-16">Đang tải nội dung...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-16">{error}</div>;
  }

  if (!theory) {
    return <div className="text-center text-gray-600 text-xl mt-16">Không tìm thấy nội dung lý thuyết.</div>;
  }

  return (
    <>
      <Head>
        <title>{theory.title} - Lý thuyết Vật lý HSG</title>
      </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl mt-8">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">{theory.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{theory.description}</p>
        <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: theory.content }}>
          {/* Content will be rendered here */}
        </div>
        <Link
          href="/theory"
          className="mt-8 inline-block bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition duration-300 shadow-md transform hover:scale-105"
        >
          &larr; Quay lại
        </Link>
      </div>
    </>
  );
};

export default TheoryDetail;
