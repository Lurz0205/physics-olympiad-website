// physics-olympiad-website/frontend/pages/practice/[slug].js
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext'; // Đã sửa đường dẫn
import Head from 'next/head';
import MathContent from '../../components/MathContent'; // Import MathContent component

const TopicQuestionsPage = () => {
  const router = useRouter();
  const { slug } = router.query; // Lấy slug từ URL
  const { user, authToken } = useContext(AuthContext);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // State để lưu câu trả lời của người dùng
  const [showSolutions, setShowSolutions] = useState(false); // State để hiển thị/ẩn giải thích

  useEffect(() => {
    const fetchTopicQuestions = async () => {
      if (!slug || !user || !authToken) {
        if (!slug) setLoading(false); // If slug is not yet available, wait
        if (!user || !authToken) setError('Bạn cần đăng nhập để xem bài tập này.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/practice/topics/${slug}/questions`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi lấy câu hỏi cho chủ đề này.');
        }

        const data = await response.json();
        setTopicData(data);
        // Initialize userAnswers based on fetched questions
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q._id] = ''; // Store selected option for each question ID
        });
        setUserAnswers(initialAnswers);

      } catch (err) {
        console.error('Lỗi fetch topic questions:', err);
        setError('Đã xảy ra lỗi khi tải bài tập: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicQuestions();
  }, [slug, user, authToken]);

  const handleOptionChange = (questionId, selectedOption) => {
    if (!showResults) { // Chỉ cho phép chọn đáp án khi chưa nộp bài
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: selectedOption,
      }));
    }
  };

  const toggleSolutions = () => {
    setShowSolutions(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang tải bài tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Không tìm thấy dữ liệu bài tập cho chủ đề này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Head>
        <title>{topicData.topic.title} - Bài tập</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{topicData.topic.title}</h1>
        <p className="text-gray-600 text-center mb-8">{topicData.topic.description}</p>

        {topicData.questions.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Chủ đề này chưa có câu hỏi nào.</p>
        ) : (
          <div className="space-y-8">
            {topicData.questions.map((q, index) => (
              <div key={q._id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Câu hỏi {index + 1}: <MathContent content={q.questionText} />
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center space-x-3 cursor-pointer p-3 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-50">
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={option}
                        checked={userAnswers[q._id] === option}
                        onChange={() => handleOptionChange(q._id, option)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-800 text-base">
                        <MathContent content={option} />
                      </span>
                    </label>
                  ))}
                </div>
                {userAnswers[q._id] && showSolutions && (
                  <div className={`mt-4 p-4 rounded-md ${userAnswers[q._id] === q.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <p className="font-semibold mb-2">Đáp án của bạn: <MathContent content={userAnswers[q._id]} /></p>
                    <p className="font-semibold mb-2">Đáp án đúng: <MathContent content={q.correctAnswer} /></p>
                    {q.explanation && (
                      <div>
                        <p className="font-semibold">Giải thích:</p>
                        <MathContent content={q.explanation} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center mt-8">
              <button
                onClick={toggleSolutions}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {showSolutions ? 'Ẩn Giải thích' : 'Hiển thị Giải thích'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicQuestionsPage;
