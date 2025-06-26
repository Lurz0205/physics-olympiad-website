// physics-olympiad-website/frontend/pages/practice/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
// MathContent component để hiển thị đề bài/lời giải nếu cần trên trang chi tiết
// import MathContent from '../../components/MathContent'; 

const PracticePage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedExercises, setGroupedExercises] = useState({}); // State để lưu bài tập đã nhóm

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API từ backend để lấy TẤT CẢ các bài tập
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises`);
        
        // Kiểm tra nếu phản hồi không phải là JSON (ví dụ: HTML lỗi 404)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`Đã xảy ra lỗi khi kết nối máy chủ: Phản hồi không phải JSON. Nội dung: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải danh sách bài tập.');
        }

        setExercises(data);

        // Nhóm bài tập theo danh mục
        const grouped = data.reduce((acc, exercise) => {
          const category = exercise.category || 'Chưa phân loại'; // Đảm bảo có danh mục
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(exercise);
          return acc;
        }, {});
        setGroupedExercises(grouped);

      } catch (err) {
        console.error('Lỗi khi tải bài tập:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải bài tập.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải danh sách bài tập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Đã xảy ra lỗi: {error}</p>
        <p className="text-md text-gray-600 text-center mt-2">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
      </div>
    );
  }

  // Lấy thứ tự ưu tiên cho các danh mục (có thể điều chỉnh tùy theo ý bạn)
  const categoryOrder = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];
  const sortedCategories = Object.keys(groupedExercises).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Cả hai không có trong thứ tự, sắp xếp alphabet
    if (indexA === -1) return 1; // A không có trong thứ tự, B có -> B đứng trước
    if (indexB === -1) return -1; // B không có trong thứ tự, A có -> A đứng trước
    return indexA - indexB; // Sắp xếp theo thứ tự định sẵn
  });


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Head>
        <title>Bài tập Vật lý - HTB</title>
        <meta name="description" content="Hệ thống bài tập Vật lý THPT được phân loại theo chủ đề và độ khó." />
      </Head>

      <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Hệ thống Bài tập Vật lý</h1>
        <p className="text-gray-700 text-lg mb-8 text-center">
          Khám phá các bài tập được phân loại theo chủ đề và độ khó, giúp bạn rèn luyện và nâng cao kỹ năng giải bài.
        </p>

        {exercises.length === 0 && !loading && !error && (
          <div className="text-center p-6 text-gray-600 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-xl">Hiện chưa có bài tập nào được thêm vào hệ thống.</p>
            <p className="text-sm mt-2">Hãy kiểm tra lại sau hoặc liên hệ quản trị viên để biết thêm chi tiết.</p>
          </div>
        )}

        {sortedCategories.map(category => (
          <section key={category} className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedExercises[category].map(exercise => (
                <div key={exercise._id} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 transform hover:scale-102 transition-transform duration-200 ease-in-out cursor-pointer">
                  <Link href={`/exercise/${exercise.slug}`}> {/* Link tới trang chi tiết bài tập */}
                    <a>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">{exercise.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{exercise.description}</p>
                      <div className="flex flex-wrap justify-between items-center text-xs mt-3">
                        <span className={`py-1 px-3 rounded-full text-white font-semibold ${
                            exercise.difficulty === 'Dễ' ? 'bg-green-500' :
                            exercise.difficulty === 'Trung bình' ? 'bg-yellow-600' :
                            exercise.difficulty === 'Khó' ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}>
                          {exercise.difficulty}
                        </span>
                        {exercise.tags && exercise.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                            {exercise.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default PracticePage;
