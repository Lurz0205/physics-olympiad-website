import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

const TheoryPage = () => {
  const { token, loading: authLoading } = useAuth();
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch if authentication is ready and user is logged in
    if (!authLoading && token) {
      const fetchTheories = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setTheories(data);
          } else {
            setError(data.message || 'Không thể tải lý thuyết.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy dữ liệu lý thuyết:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchTheories();
    } else if (!authLoading && !token) {
      // If not authenticated, stop loading and show message (or redirect)
      setLoading(false);
      setError('Vui lòng đăng nhập để xem nội dung này.');
    }
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="text-center text-primary text-xl mt-16">Đang tải lý thuyết...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-16">{error}</div>;
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl text-center mt-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Truy cập bị từ chối</h2>
        <p className="text-lg text-gray-700 mb-6">
          Bạn cần đăng nhập để xem nội dung lý thuyết.
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
        <title>Lý thuyết chuyên sâu - Vật lý HSG</title>
      </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl mt-8">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Lý thuyết Chuyên sâu</h1>
        {theories.length === 0 ? (
          <p className="text-gray-600 text-center">Chưa có chủ đề lý thuyết nào được thêm. Vui lòng quay lại sau!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theories.map((theory) => (
              <Link key={theory._id} href={`/theory/${theory.slug}`} className="block bg-secondary p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <h2 className="text-xl font-semibold text-dark mb-2">{theory.title}</h2>
                <p className="text-gray-600 line-clamp-2">{theory.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TheoryPage;
```javascript
// physics-olympiad-website/frontend/pages/theory/[slug].js
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
