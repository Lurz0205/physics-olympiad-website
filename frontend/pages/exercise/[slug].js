// physics-olympiad-website/frontend/pages/exercise/[slug].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MathContent from '../../components/MathContent'; // Import component để render Markdown/LaTeX
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // Để kiểm tra đăng nhập và hiển thị lời giải

const ExerciseDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query; // Lấy slug từ URL
  const { user } = useAuth(); // Lấy thông tin user để biết đã đăng nhập hay chưa

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // Lưu đáp án người dùng cho trắc nghiệm
  const [showSolution, setShowSolution] = useState(false); // State để hiển thị/ẩn lời giải (cho cả tự luận và trắc nghiệm)

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchExercise = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises/slug/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải chi tiết bài tập.');
        }
        setExercise(data);

        // Khởi tạo userAnswers cho bài tập trắc nghiệm
        if (data.type === 'Trắc nghiệm' && data.questions) {
          const initialAnswers = {};
          data.questions.forEach((q, index) => {
            initialAnswers[q._id || `q-${index}`] = ''; // Dùng _id hoặc index làm key
          });
          setUserAnswers(initialAnswers);
        }

      } catch (err) {
        console.error('Error fetching exercise detail:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải chi tiết bài tập.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [slug]);

  // Xử lý thay đổi đáp án của người dùng cho câu hỏi trắc nghiệm
  const handleOptionChange = (questionId, selectedOption) => {
    if (!showSolution) { // Không cho phép thay đổi đáp án sau khi đã hiện lời giải
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: selectedOption,
      }));
    }
  };

  // Nút hiển thị lời giải / chấm điểm (cho trắc nghiệm)
  const toggleSolution = () => {
    setShowSolution(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải chi tiết bài tập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Đã xảy ra lỗi: {error}</p>
        <p className="text-md text-gray-600 text-center mt-2">Vui lòng thử lại hoặc <Link href="/exercise"><a className="text-blue-600 hover:underline">quay về danh sách bài tập</a></Link>.</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700 text-center">Không tìm thấy bài tập này.</p>
        <Link href="/exercise">
            <a className="mt-4 btn-primary">Quay về danh sách bài tập</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Head>
        <title>{exercise.title} - Bài tập Vật lý HTB</title>
        <meta name="description" content={exercise.description || exercise.title} />
      </Head>

      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/exercise">
            <a className="hover:underline text-blue-600">Bài tập</a>
          </Link>
          <span className="mx-2">/</span>
          <span>{exercise.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{exercise.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-semibold">
            {exercise.category}
          </span>
          <span className={`py-1 px-3 rounded-full text-sm font-semibold ${
              exercise.difficulty === 'Dễ' ? 'bg-green-200 text-green-800' :
              exercise.difficulty === 'Trung bình' ? 'bg-yellow-200 text-yellow-800' :
              exercise.difficulty === 'Khó' ? 'bg-orange-200 text-orange-800' :
              'bg-red-200 text-red-800'
            }`}>
            {exercise.difficulty}
          </span>
          {/* THAY ĐỔI MỚI: Hiển thị loại bài tập (Tự luận/Trắc nghiệm) */}
          <span className={`py-1 px-3 rounded-full text-sm font-semibold ${
            exercise.type === 'Tự luận' ? 'bg-indigo-200 text-indigo-800' : 'bg-purple-200 text-purple-800'
          }`}>
            Loại: {exercise.type}
          </span>

          {exercise.tags && exercise.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* ========================================================= */}
        {/* Phần hiển thị nội dung tùy thuộc vào loại bài tập */}
        {/* ========================================================= */}
        {exercise.type === 'Tự luận' ? (
          <>
            <div className="prose max-w-none text-gray-800 leading-relaxed mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Đề bài:</h2>
              <MathContent content={exercise.problemStatement} />
            </div>

            {/* Lời giải cho Tự luận */}
            {user ? (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <button
                  onClick={toggleSolution}
                  className="btn-primary flex items-center gap-2"
                >
                  {showSolution ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      Ẩn Lời giải
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Hiện Lời giải
                    </>
                  )}
                </button>

                {showSolution && exercise.solution && (
                  <div className="prose max-w-none text-gray-800 leading-relaxed mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Lời giải:</h3>
                    <MathContent content={exercise.solution} />
                  </div>
                )}
                {showSolution && !exercise.solution && (
                  <div className="text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    Chưa có lời giải cho bài tập này.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 border-t border-gray-200 pt-8 text-center p-6 bg-blue-50 rounded-lg border-blue-200">
                <p className="text-xl font-semibold text-blue-800 mb-3">Đăng nhập để xem lời giải chi tiết!</p>
                <Link href="/login">
                  <a className="btn-primary">Đăng nhập ngay</a>
                </Link>
              </div>
            )}
          </>
        ) : ( /* type === 'Trắc nghiệm' */
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Câu hỏi Trắc nghiệm:</h2>
            <div className="prose max-w-none text-gray-800 leading-relaxed mb-6">
              <MathContent content={exercise.problemStatement} /> {/* ProblemStatement là câu hỏi chung / hướng dẫn */}
            </div>

            {exercise.questions && exercise.questions.length > 0 ? (
              <div className="space-y-6">
                {exercise.questions.map((q, qIndex) => (
                  <div key={q._id || `q-${qIndex}`} className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} /></h3>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200
                            ${!showSolution ? 'hover:bg-blue-50' : ''}
                            ${showSolution && option === q.correctAnswer ? 'bg-green-100 border border-green-300' : ''}
                            ${showSolution && userAnswers[q._id || `q-${qIndex}`] === option && option !== q.correctAnswer ? 'bg-red-100 border border-red-300' : ''}
                          `}
                        >
                          <input
                            type="radio"
                            name={`question-${q._id || `q-${qIndex}`}`}
                            value={option}
                            checked={userAnswers[q._id || `q-${qIndex}`] === option}
                            onChange={() => handleOptionChange(q._id || `q-${qIndex}`, option)}
                            className="form-radio h-5 w-5 text-blue-600 cursor-pointer"
                            disabled={showSolution} // Vô hiệu hóa chọn đáp án khi đã hiện lời giải
                          />
                          <span className="text-base text-gray-800">
                            <MathContent content={option} />
                          </span>
                        </label>
                      ))}
                    </div>
                    {showSolution && (userAnswers[q._id || `q-${qIndex}`] || q.explanation) && (
                      <div className="mt-4 p-4 rounded-lg border bg-gray-100 border-gray-300 text-gray-800">
                        {userAnswers[q._id || `q-${qIndex}`] && (
                          <p className="font-semibold mb-2">
                            Đáp án của bạn: <span className={userAnswers[q._id || `q-${qIndex}`] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}>
                              <MathContent content={userAnswers[q._id || `q-${qIndex}`]} />
                            </span>
                          </p>
                        )}
                        <p className="font-semibold mb-2">Đáp án đúng: <span className="text-green-700"><MathContent content={q.correctAnswer} /></span></p>
                        {q.explanation && (
                          <div>
                            <p className="font-semibold mt-3">Giải thích:</p>
                            <MathContent content={q.explanation} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-600 bg-gray-50 rounded-lg">Bài tập trắc nghiệm này chưa có câu hỏi nào được thêm.</div>
            )}

            {user ? (
              <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                <button
                  onClick={toggleSolution}
                  className="btn-primary flex items-center justify-center mx-auto gap-2"
                >
                  {showSolution ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      Ẩn Giải thích & Đáp án
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Hiện Giải thích & Đáp án
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-8 border-t border-gray-200 pt-8 text-center p-6 bg-blue-50 rounded-lg border-blue-200">
                <p className="text-xl font-semibold text-blue-800 mb-3">Đăng nhập để xem đáp án và lời giải chi tiết!</p>
                <Link href="/login">
                  <a className="btn-primary">Đăng nhập ngay</a>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExerciseDetailPage;
