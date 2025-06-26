// physics-olympiad-website/frontend/pages/tests/[slug].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import MathContent from '../../components/MathContent';

const TestDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, token: authToken } = useAuth();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState({});

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!slug || !user || !authToken) {
        if (!slug) setLoading(false);
        if (!user || !authToken) setError('Bạn cần đăng nhập để xem đề thi này.');
        setLoading(false);
        return;
      }

      try {
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/${slug}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          throw new Error(errorData.message || 'Lỗi khi lấy chi tiết đề thi.');
        }

        const data = await testResponse.json();
        setTestData(data);

        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q._id] = '';
        });
        setUserAnswers(initialAnswers);

      } catch (err) {
        console.error('Lỗi fetch test details:', err);
        setError('Đã xảy ra lỗi khi tải đề thi: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [slug, user, authToken]);

  const handleOptionChange = (questionId, selectedOption) => {
    if (!showResults) {
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: selectedOption,
      }));
    }
  };

  const handleSubmitTest = async () => {
    if (!testData) return;

    setLoading(true);
    setError(null);

    try {
      const answersResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/${slug}/answers`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!answersResponse.ok) {
        const errorData = await answersResponse.json();
        throw new Error(errorData.message || 'Lỗi khi lấy đáp án đúng.');
      }

      const answersData = await answersResponse.json();
      const correctAnswersMap = {};
      answersData.forEach(ans => {
        correctAnswersMap[ans._id] = {
          correctAnswer: ans.correctAnswer,
          explanation: ans.explanation
        };
      });
      setCorrectAnswers(correctAnswersMap);

      let correctCount = 0;
      testData.questions.forEach(q => {
        if (userAnswers[q._id] === correctAnswersMap[q._id]?.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);

    } catch (err) {
      console.error('Lỗi khi nộp bài:', err);
      setError('Đã xảy ra lỗi khi nộp bài: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Đang tải đề thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <p className="text-xl text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Không tìm thấy đề thi này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"> {/* Responsive padding */}
      <Head>
        <title>{testData.title} - Đề thi Online</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"> {/* Responsive padding */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">{testData.title}</h1> {/* Responsive font size */}
        <p className="text-base sm:text-lg text-gray-600 text-center mb-6 sm:mb-8">Thời lượng: {testData.duration} phút</p> {/* Responsive font size */}

        {testData.questions.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Đề thi này chưa có câu hỏi nào.</p>
        ) : (
          <div className="space-y-8">
            {testData.questions.map((q, index) => (
              <div key={q._id} className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3"> {/* Responsive font size */}
                  Câu hỏi {index + 1}: <MathContent content={q.questionText} />
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-md transition-colors duration-200 ease-in-out
                        ${showResults && userAnswers[q._id] === option && option === correctAnswers[q._id]?.correctAnswer ? 'bg-green-100' : ''}
                        ${showResults && userAnswers[q._id] === option && option !== correctAnswers[q._id]?.correctAnswer ? 'bg-red-100' : ''}
                        ${showResults && option === correctAnswers[q._id]?.correctAnswer && userAnswers[q._id] !== option ? 'bg-green-50 border-green-300' : ''}
                        ${!showResults ? 'hover:bg-gray-50' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={option}
                        checked={userAnswers[q._id] === option}
                        onChange={() => handleOptionChange(q._id, option)}
                        className="form-radio h-5 w-5 text-blue-600"
                        disabled={showResults}
                      />
                      <span className="text-sm sm:text-base text-gray-800"> {/* Responsive font size */}
                        <MathContent content={option} />
                      </span>
                    </label>
                  ))}
                </div>
                {showResults && correctAnswers[q._id] && (
                  <div className="mt-4 p-4 rounded-lg border bg-gray-50 border-gray-200">
                    <p className="font-semibold mb-2 text-sm sm:text-base">Đáp án đúng: <MathContent content={correctAnswers[q._id].correctAnswer} /></p>
                    {correctAnswers[q._id].explanation && (
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Giải thích:</p>
                        <MathContent content={correctAnswers[q._id].explanation} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {!showResults && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmitTest}
                  className="btn-primary"
                >
                  Nộp bài và xem kết quả
                </button>
              </div>
            )}
            {showResults && (
              <div className="mt-8 text-center">
                <p className="text-xl sm:text-2xl font-bold text-blue-700">Bạn đã trả lời đúng {score} / {testData.questions.length} câu hỏi.</p>
                <button
                  onClick={() => router.push('/tests')}
                  className="mt-4 btn-secondary"
                >
                  Quay lại danh sách đề thi
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetailPage;
