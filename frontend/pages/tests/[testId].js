import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

const TestDetailPage = () => {
  const router = useRouter();
  const { testId } = router.query;
  const { user, token, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds (20 * 60)
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (testId && !authLoading) {
      if (!token) {
        setLoading(false);
        setError('Vui lòng đăng nhập để làm đề thi này.');
        return;
      }

      const fetchQuestions = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?testId=${testId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setQuestions(data);
            const initialAnswers = data.reduce((acc, q) => ({ ...acc, [q._id]: '' }), {});
            setUserAnswers(initialAnswers);
            setIsRunning(true); // Start timer automatically when questions load
          } else {
            setError(data.message || 'Không thể tải câu hỏi cho đề thi này.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy dữ liệu câu hỏi đề thi:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [testId, token, authLoading]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      handleSubmitQuiz(); // Auto-submit when time runs out
    } else if (!isRunning || showResults) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [timeLeft, isRunning, showResults]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsRunning(false); // Stop the timer

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/test-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testId,
          userAnswers,
          timeTakenSeconds: (1200 - timeLeft), // Calculate time taken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setScore(data.score); // Backend returns the calculated score
        setShowResults(true);
      } else {
        setError(data.message || 'Không thể gửi kết quả bài thi.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi kết quả bài thi:', err);
      setError('Đã xảy ra lỗi khi kết nối máy chủ.');
    }
  };

  if (loading || authLoading) {
    return <div className="text-center text-primary text-xl mt-16">Đang tải đề thi...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-16">{error}</div>;
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl text-center mt-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Truy cập bị từ chối</h2>
        <p className="text-lg text-gray-700 mb-6">
          Bạn cần đăng nhập để làm đề thi này.
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
        <title>{testId.replace(/_/g, ' ')} - Đề thi Online</title>
      </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl mt-8">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Đề thi: {testId.replace(/_/g, ' ')}</h1>

        {!showResults && (
          <div className="text-center text-2xl font-bold text-accent mb-6">
            Thời gian còn lại: {formatTime(timeLeft)}
          </div>
        )}

        {questions.length === 0 ? (
          <p className="text-gray-600 text-center">Chưa có câu hỏi nào cho đề thi này. Vui lòng quay lại sau!</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }} className="space-y-8">
            {questions.map((q, index) => (
              <div key={q._id} className="bg-secondary p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold text-dark mb-4">
                  Câu {index + 1}: {q.questionText}
                </p>
                <div className="space-y-2">
                  {q.options && q.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center space-x-2 text-gray-700">
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={option}
                        checked={userAnswers[q._id] === option}
                        onChange={() => handleAnswerChange(q._id, option)}
                        className="form-radio h-4 w-4 text-primary rounded-full focus:ring-primary"
                        disabled={showResults || timeLeft === 0}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div className="mt-4 p-3 rounded-md bg-blue-100 border border-blue-300">
                    <p className="font-medium text-blue-800">
                      Đáp án đúng: <span className="font-bold">{q.correctAnswer}</span>
                    </p>
                    <p className="text-blue-700">
                      Giải thích: {q.explanation}
                    </p>
                    <p className={`font-semibold mt-2 ${userAnswers[q._id] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      Câu trả lời của bạn: {userAnswers[q._id] || '[Chưa trả lời]'}
                      {userAnswers[q._id] === q.correctAnswer ? ' (Đúng)' : ' (Sai)'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {!showResults ? (
              <button
                type="submit"
                className="bg-primary text-white font-bold py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={timeLeft === 0}
              >
                Nộp bài
              </button>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold text-primary mb-4">
                  Bạn đã trả lời đúng {score} / {questions.length} câu!
                </p>
                <Link href="/tests" className="bg-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105">
                  Quay lại danh sách đề thi
                </Link>
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default TestDetailPage;
