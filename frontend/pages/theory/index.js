// physics-olympiad-website/frontend/pages/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Website Ôn thi HSG Vật lý</title>
        <meta name="description" content="Website ôn thi học sinh giỏi Vật lý bảng không chuyên" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="text-center py-16 px-4 bg-white shadow-xl rounded-xl mt-8 w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold text-primary mb-6">
          Nền tảng Ôn thi HSG Vật lý
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Cung cấp tài liệu lý thuyết chuyên sâu, hệ thống bài tập đa dạng và đề thi chọn lọc
          giúp bạn đạt kết quả tốt nhất trong các kỳ thi học sinh giỏi Vật lý bảng không chuyên.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/theory" className="bg-primary text-white text-xl px-8 py-4 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105">
            Khám phá Lý thuyết
          </Link>
          <Link href="/practice" className="bg-accent text-white text-xl px-8 py-4 rounded-full hover:bg-red-700 transition duration-300 shadow-lg transform hover:scale-105">
            Luyện tập Ngay
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16 px-4 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-primary mb-4">Lý thuyết chuyên sâu</h2>
          <p className="text-gray-600">
            Các bài giảng được biên soạn chuyên sâu, đào sâu các khía cạnh và phương pháp giải quyết bài toán phức tạp.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-primary mb-4">Hệ thống bài tập đa dạng</h2>
          <p className="text-gray-600">
            Bài tập trắc nghiệm và tự luận được phân loại theo độ khó và chuyên đề, kèm lời giải chi tiết.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-primary mb-4">Đề thi chọn lọc &amp; cập nhật</h2>
          <p className="text-gray-600">
            Tổng hợp các đề thi cấp huyện, tỉnh, khu vực, quốc gia với tính năng chấm điểm online.
          </p>
        </div>
      </section>
    </>
  );
}
