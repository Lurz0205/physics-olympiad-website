// physics-olympiad-website/frontend/pages/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>HTB - Nền tảng ôn thi HSG Vật Lí THPT</title>
        <meta name="description" content="Nền tảng ôn thi học sinh giỏi Vật lý" />
      </Head>

      <main className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center my-8 border border-gray-100"> {/* Responsive padding */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-700 mb-4 sm:mb-6 leading-tight"> {/* Responsive font sizes */}
          NỀN TẢNG ÔN THI HSG VẬT LÍ THPT
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto"> {/* Responsive font sizes */}
          Cung cấp tài liệu lý thuyết chuyên sâu, hệ thống bài tập đa dạng và đề thi chọn lọc
          giúp bạn đạt kết quả tốt nhất trong các kỳ thi học sinh giỏi Vật lí bảng không chuyên.
        </p>

        {/* THAY ĐỔI QUAN TRỌNG: Điều chỉnh lớp Tailwind cho khoảng cách */}
        {/* flex-col: xếp dọc trên mobile; space-y-4: khoảng cách dọc 16px giữa các mục */}
        {/* sm:flex-row: xếp ngang từ màn hình sm trở lên; sm:space-x-4: khoảng cách ngang 16px giữa các mục */}
        {/* sm:space-y-0: đảm bảo không có khoảng cách dọc khi ở chế độ ngang */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center mb-8 sm:mb-12">
          <Link href="/theory">
            <a className="btn-primary w-full sm:w-auto"> {/* Đảm bảo nút chiếm toàn bộ chiều rộng trên mobile */}
              Khám phá Lý thuyết
            </a>
          </Link>
          <Link href="/exercise">
            <a className="btn-primary w-full sm:w-auto bg-red-600 hover:bg-red-700"> {/* Màu nút riêng */}
              Luyện tập Ngay
            </a>
          </Link>
        </div>

        <section className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">✨ Chúng ta có gì? ✨</h2> {/* Responsive font sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"> {/* Grid-cols-1 trên mobile, 3 trên md */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3">📝 Lý thuyết chuyên sâu</h3> {/* Responsive font sizes */}
              <p className="text-sm sm:text-base text-gray-700">Tóm tắt và trình bày chi tiết các chuyên đề vật lý trọng tâm, giúp bạn nắm vững kiến thức từ cơ bản đến nâng cao.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3">📚 Hệ thống bài tập đa dạng</h3>
              <p className="text-sm sm:text-base text-gray-700">Hàng trăm bài tập được chọn lọc, phân loại theo chủ đề và độ khó, kèm lời giải chi tiết giúp bạn rèn luyện kỹ năng giải bài.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3">📄 Đề thi chọn lọc & cập nhật</h3>
              <p className="text-sm sm:text-base text-gray-700">Tổng hợp các đề thi học sinh giỏi từ các năm trước và đề thi thử mới nhất, giúp bạn làm quen với cấu trúc và áp lực phòng thi.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
