// physics-olympiad-website/frontend/pages/tests/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        // THAY ĐỔI: Sử dụng /api/exams thay vì /api/tests
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải danh sách đề thi.');
        }

        // Chỉ hiển thị các đề thi đã xuất bản trên trang công khai
        setExams(data.filter(exam => exam.isPublished)); 

      } catch (err) {
        console.error('Error fetching public exams:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []); // Dependency array rỗng để chỉ chạy một lần khi component mount

  return (
    <>
      <Head>
        <title>Đề thi Online - HTB</title>
      </Head>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 animate-fade-in-down">
          Đề thi Online
        </h1>

        {loading && (
          <div className="text-center py-8 text-lg text-gray-700">Đang tải danh sách đề thi...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {!loading && !error && exams.length === 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md max-w-2xl mx-auto">
            <p className="font-semibold text-lg mb-2">Chưa có đề thi nào!</p>
            <p>Hiện tại chưa có đề thi nào được xuất bản. Vui lòng quay lại sau nhé!</p>
          </div>
        )}

        {!loading && !error && exams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {exam.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{exam.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Thời gian: <span className="font-semibold text-blue-600 ml-1">{exam.duration} phút</span>
                  </div>
                  <Link href={`/tests/${exam.slug}`}>
                    <a className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Vào làm bài
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExamsPage;
