// physics-olympiad-website/frontend/pages/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4"> {/* Đã sửa bg-red-200 thành bg-white */}
      <Head>
        <title>Nền tảng Ôn thi HSG Vật lý</title>
        <meta name="description" content="Nền tảng ôn thi học sinh giỏi Vật lý" />
      </Head>

      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center my-8 border border-gray-100">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-6 leading-tight">
          Nền tảng Ôn thi HSG Vật lý
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Cung cấp tài liệu lý thuyết chuyên sâu, hệ thống bài tập đa dạng và đề thi chọn lọc
          giúp bạn đạt kết quả tốt nhất trong các kỳ thi học sinh giỏi Vật lý bằng không chuyên.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/theory">
            <a className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
              Khám phá Lý thuyết
            </a>
          </Link>
          <Link href="/practice">
            <a className="px-8 py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
              Luyện tập Ngay
            </a>
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Điểm nổi bật của nền tảng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Lý thuyết chuyên sâu</h3>
              <p className="text-gray-700">Tóm tắt và trình bày chi tiết các chuyên đề vật lý trọng tâm, giúp bạn nắm vững kiến thức từ cơ bản đến nâng cao.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Hệ thống bài tập đa dạng</h3>
              <p className="text-gray-700">Hàng trăm bài tập được chọn lọc, phân loại theo chủ đề và độ khó, kèm lời giải chi tiết giúp bạn rèn luyện kỹ năng giải bài.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Đề thi chọn lọc & cập nhật</h3>
              <p className="text-gray-700">Tổng hợp các đề thi học sinh giỏi từ các năm trước và đề thi thử mới nhất, giúp bạn làm quen với cấu trúc và áp lực phòng thi.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer hoặc các thành phần chung khác có thể được đặt ở đây hoặc trong Layout */}
    </div>
  );
};

export default HomePage;
