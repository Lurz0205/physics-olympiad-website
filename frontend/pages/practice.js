import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

const PracticePage = () => {
  const { token, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!authLoading && token) {
      const fetchQuestions = async () => {
        try {
          // Fetch questions without a specific testId to get all general practice questions
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setQuestions(data);
            const initialAnswers = data.reduce((acc, q) => ({ ...acc, [q._id]: '' }), {});
            setUserAnswers(initialAnswers);
          } else {
            setError(data.message || 'Không thể tải câu hỏi.');
          }
        } catch (err) {
          console.error('Lỗi khi lấy dữ liệu câu hỏi:', err);
          setError('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    } else if (!authLoading && !token) {
      setLoading(false);
      setError('Vui lòng đăng nhập để làm bài tập.');
    }
  }, [token, authLoading]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach(q => {
      // For multiple-choice, simply compare the selected answer with the correct one
      if (userAnswers[q._id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  if (loading || authLoading) {
    return <div className="text-center text-primary text-xl mt-16">Đang tải bài tập...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-16">{error}</div>;
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl text-center mt-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Truy cập bị từ chối</h2>
        <p className="text-lg text-gray-700 mb-6">
          Bạn cần đăng nhập để làm bài tập.
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
        <title>Bài tập luyện tập - Vật lý HSG</title>
      </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl mt-8">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Hệ thống Bài tập</h1>

        {questions.length === 0 ? (
          <p className="text-gray-600 text-center">Chưa có bài tập nào được thêm. Vui lòng quay lại sau!</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }} className="space-y-8">
            {questions.map((q, index) => (
              <div key={q._id} className="bg-secondary p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold text-dark mb-4">
                  Câu {index + 1}: {q.questionText}
                </p>
                {/* Only handle multiple-choice now */}
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
                        disabled={showResults}
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
                className="bg-primary text-white font-bold py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
              >
                Nộp bài
              </button>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold text-primary mb-4">
                  Bạn đã trả lời đúng {score} / {questions.length} câu!
                </p>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setScore(0);
                    // Reset user answers for a new attempt
                    const initialAnswers = questions.reduce((acc, q) => ({ ...acc, [q._id]: '' }), {});
                    setUserAnswers(initialAnswers);
                  }}
                  className="bg-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105"
                >
                  Làm lại
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default PracticePage;
