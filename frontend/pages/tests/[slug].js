// physics-olympiad-website/frontend/pages/tests/[slug].js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import MathContent from '../../components/MathContent';

const ExamDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, token } = useAuth();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: userAnswer }
  const [timeRemaining, setTimeRemaining] = useState(0); // Thời gian còn lại bằng giây
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState(null); // Kết quả sau khi nộp bài

  const timerRef = useRef(null); // Ref để lưu ID của setInterval

  // Fetch exam details
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchExam = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/slug/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải đề thi.');
        }

        setExam(data);
        setTimeRemaining(data.duration * 60); // Chuyển phút sang giây
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q._id] = ''; // Khởi tạo đáp án rỗng cho mỗi câu hỏi
        });
        setUserAnswers(initialAnswers);

      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải đề thi.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [slug]);

  // Start timer when exam starts
  useEffect(() => {
    if (examStarted && !examFinished && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam(true); // Tự động nộp bài khi hết giờ
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Clear interval on component unmount or exam finished
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted, examFinished, timeRemaining]); // timeRemaining ở đây để re-evaluate setInterval khi nó thay đổi (như khi tự động nộp bài)

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle user answer change for a specific question
  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Submit exam to backend
  const handleSubmitExam = useCallback(async (isTimeUp = false) => {
    if (!user || !token || !exam || examFinished) return; // Chỉ nộp khi đã đăng nhập và bài chưa kết thúc

    setExamFinished(true); // Đánh dấu bài thi đã kết thúc
    if (timerRef.current) {
      clearInterval(timerRef.current); // Dừng đồng hồ
    }
    setLoading(true); // Bật loading khi đang nộp bài
    setError(null);

    const timeTaken = exam.duration * 60 - timeRemaining; // Thời gian thực tế đã làm bài

    // Chuẩn bị dữ liệu gửi đi
    const submissionData = {
      examId: exam._id,
      userAnswers: Object.keys(userAnswers).map(questionId => ({
        questionId: questionId,
        userAnswer: userAnswers[questionId],
      })),
      timeTaken: timeTaken,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const resultData = await response.json();

      if (!response.ok) {
        throw new Error(resultData.message || 'Lỗi khi nộp bài thi.');
      }
      setExamResult(resultData); // Lưu kết quả nhận được từ backend
    } catch (err) {
      console.error('Lỗi khi nộp bài thi:', err);
      setError(err.message || 'Đã xảy ra lỗi khi nộp bài thi.');
    } finally {
      setLoading(false); // Tắt loading
    }
  }, [user, token, exam, examFinished, userAnswers, timeRemaining]); // Thêm dependencies

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold mb-4">Bạn cần đăng nhập để làm bài thi này.</p>
        <Link href="/login">
          <a className="btn-primary">Đăng nhập ngay</a>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Đã xảy ra lỗi: {error}</p>
        <p className="text-md text-gray-600 text-center mt-2">Vui lòng thử lại hoặc <Link href="/tests"><a className="text-blue-600 hover:underline">quay về danh sách đề thi</a></Link>.</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700 text-center">Không tìm thấy đề thi này.</p>
        <Link href="/tests">
            <a className="mt-4 btn-primary">Quay về danh sách đề thi</a>
        </Link>
      </div>
    );
  }

  // Component hiển thị kết quả sau khi nộp bài
  const ResultDisplay = ({ result, examData }) => {
    if (!result || !examData) return null;

    const percentage = ((result.score / 10) * 100).toFixed(0);
    
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Kết quả Bài thi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Điểm số:</span>
            <span className="text-blue-700 text-2xl font-bold">{result.score} / 10</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Số câu đúng:</span>
            <span className="text-green-700 text-2xl font-bold">{result.correctAnswersCount} / {result.totalQuestions}</span>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Số câu sai:</span>
            <span className="text-red-700 text-2xl font-bold">{result.incorrectAnswersCount} / {result.totalQuestions}</span>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Thời gian làm bài:</span>
            <span className="text-yellow-700 text-2xl font-bold">{formatTime(result.timeTaken)}</span>
          </div>
        </div>
        
        <p className="text-center text-lg text-gray-700 mb-8">
          Bạn đã hoàn thành bài thi với **{result.score} điểm** ({percentage}%).
        </p>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Xem lại các câu hỏi và đáp án:</h3>
        <div className="space-y-6">
          {examData.questions.map((q, qIndex) => {
            const userAnswerEntry = result.userAnswers.find(ua => ua.questionId === q._id);
            const userAnswer = userAnswerEntry ? userAnswerEntry.userAnswer : '';
            const isCorrect = userAnswerEntry ? userAnswerEntry.isCorrect : false;

            return (
              <div key={q._id || `q-${qIndex}`} className={`p-5 rounded-lg border shadow-sm 
                ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} /></h4>
                <div className="space-y-2 mb-4">
                  {q.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center space-x-3 p-3 rounded-md 
                        ${option === q.correctAnswer ? 'bg-green-100 font-bold text-green-800 border-green-400' : ''}
                        ${option === userAnswer && option !== q.correctAnswer ? 'bg-red-100 font-bold text-red-800 border-red-400' : ''}
                        ${option === userAnswer && option === q.correctAnswer ? 'bg-green-100 font-bold text-green-800 border-green-400' : ''}
                        ${option !== userAnswer && option !== q.correctAnswer && option !== userAnswer ? 'bg-gray-50 text-gray-700' : ''}
                        border`}
                    >
                      <input
                        type="radio"
                        checked={option === userAnswer}
                        disabled // Disabled after submission
                        className={`h-5 w-5 ${option === q.correctAnswer ? 'text-green-600' : 'text-blue-600'}`}
                      />
                      <span className="text-base">
                        <MathContent content={option} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800">
                    <p className="font-semibold mb-2">Đáp án đúng: <span className="text-green-700"><MathContent content={q.correctAnswer} /></span></p>
                    {userAnswer && <p className="font-semibold mb-2">Đáp án của bạn: <span className={isCorrect ? 'text-green-700' : 'text-red-700'}><MathContent content={userAnswer} /></span></p>}
                    {q.explanation && (
                      <div>
                        <p className="font-semibold mt-3">Giải thích:</p>
                        <MathContent content={q.explanation} />
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
            <Link href="/tests">
                <a className="btn-primary">Quay lại danh sách Đề thi</a>
            </Link>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Head>
        <title>{exam.title} - Đề thi Online</title>
        <meta name="description" content={exam.description || exam.title} />
      </Head>

      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/tests">
            <a className="hover:underline text-blue-600">Đề thi Online</a>
          </Link>
          <span className="mx-2">/</span>
          <span>{exam.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{exam.title}</h1>
        <p className="text-gray-600 mb-4">{exam.description}</p>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-semibold">
            {exam.category}
          </span>
          <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm font-semibold">
            Số câu hỏi: {exam.questions.length}
          </span>
          <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-sm font-semibold">
            Thời lượng: {exam.duration} phút
          </span>
          {exam.isPublished ? (
            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-semibold">
              Đã xuất bản
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-semibold">
              Chưa xuất bản
            </span>
          )}
        </div>

        {examFinished && examResult ? (
          <ResultDisplay result={examResult} examData={exam} />
        ) : (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg mb-6 flex justify-between items-center">
              <p className="font-semibold text-lg">Thời gian còn lại:</p>
              <p className="text-3xl font-bold">{formatTime(timeRemaining)}</p>
            </div>

            {!examStarted ? (
              <div className="text-center p-8 border rounded-lg bg-gray-50">
                <p className="text-lg text-gray-700 mb-4">Nhấn nút "Bắt đầu làm bài" để khởi động đồng hồ và bắt đầu làm bài thi.</p>
                <button
                  onClick={() => setExamStarted(true)}
                  className="btn-primary"
                >
                  Bắt đầu làm bài
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Các câu hỏi:</h2>
                {exam.questions && exam.questions.length > 0 ? (
                  <div className="space-y-6">
                    {exam.questions.map((q, qIndex) => (
                      <div key={q._id || `q-${qIndex}`} className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} /></h3>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => (
                            <label
                              key={optIndex}
                              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-50
                                ${userAnswers[q._id || `q-${qIndex}`] === option ? 'bg-blue-100 border border-blue-300' : ''}`}
                            >
                              <input
                                type="radio"
                                name={`question-${q._id || `q-${qIndex}`}`}
                                value={option}
                                checked={userAnswers[q._id || `q-${qIndex}`] === option}
                                onChange={() => handleAnswerChange(q._id || `q-${qIndex}`, option)}
                                className="form-radio h-5 w-5 text-blue-600 cursor-pointer"
                              />
                              <span className="text-base text-gray-800">
                                <MathContent content={option} />
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-600 bg-gray-50 rounded-lg">Đề thi này chưa có câu hỏi nào.</div>
                )}

                <div className="mt-8 text-center">
                  <button
                    onClick={() => handleSubmitExam(false)}
                    className="btn-primary px-8 py-3 text-lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ExamDetailPage;
