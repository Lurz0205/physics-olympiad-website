// frontend/pages/theory/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const TheoryListPage = () => {
  const { user, token, authLoading } = useAuth();
  const [theories, setTheories] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);
  const [groupedTheories, setGroupedTheories] = useState({});

  useEffect(() => {
    // Nếu AuthProvider đang xác thực, đợi nó xong
    if (authLoading) {
      return;
    }

    // Nếu AuthProvider đã xong và không có user, hiển thị lỗi
    if (!user) {
      setError('Bạn cần đăng nhập để xem các chủ đề lý thuyết.');
      return;
    }

    // Khi user đã có, bắt đầu fetch dữ liệu
    const fetchTheories = async () => {
      setLoadingContent(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/theory`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
              throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
          }
          throw new Error(data.message || 'Lỗi khi tải danh sách lý thuyết.');
        }
        setTheories(data);

        const grouped = data.reduce((acc, theory) => {
          const category = theory.category || 'Chưa phân loại';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(theory);
          return acc;
        }, {});
        setGroupedTheories(grouped);

      } catch (err) {
        console.error('Lỗi khi tải lý thuyết:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải lý thuyết.');
      } finally {
        setLoadingContent(false);
      }
    };

    fetchTheories();
  }, [user, token, authLoading]);

  // Nếu authLoading đã xong nhưng không có user
  if (!user && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Bạn cần đăng nhập để xem các chủ đề lý thuyết.</p>
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

  const categoryOrder = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];
  const sortedCategories = Object.keys(groupedTheories).sort((a, b) => {
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
        <title>Lý thuyết Vật lý - HTB</title>
        <meta name="description" content="Hệ thống lý thuyết Vật lý THPT được phân loại theo chủ đề." />
      </Head>

      <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Hệ thống Lý thuyết Vật lý</h1>
        <p className="text-gray-700 text-lg mb-8 text-center">
          Tổng hợp các chủ đề lý thuyết quan trọng, được trình bày rõ ràng và khoa học.
        </p>

        {loadingContent ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">Đang tải chủ đề lý thuyết...</p>
          </div>
        ) : theories.length === 0 ? (
          <p className="p-6 text-gray-600 bg-gray-50 rounded-lg shadow-inner text-center">
            Hiện chưa có chủ đề lý thuyết nào được thêm vào hệ thống.
          </p>
        ) : (
          sortedCategories.map(category => (
            <section key={category} className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTheories[category].map(theory => (
                  // THAY ĐỔI TẠI ĐÂY: Bọc toàn bộ div card bằng Link
                  <Link key={theory._id} href={`/theory/${theory.slug}`} passHref>
                    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 transform hover:scale-102 transition-transform duration-200 ease-in-out cursor-pointer h-full flex flex-col justify-between">
                      <div> {/* Dùng div này để nhóm nội dung text */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{theory.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{theory.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs mt-3">
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{theory.category}</span>
                        {theory.tags && theory.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default TheoryListPage;
