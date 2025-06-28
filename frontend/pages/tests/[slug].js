// frontend/pages/tests/[slug].js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import MathContent from '../../components/MathContent'; // Component để render Markdown/LaTeX
// Đảm bảo CSS của KaTeX được import toàn cục ở _app.js.
// Nếu bạn muốn import ở đây, hãy bỏ comment dòng sau (nhưng _app.js được khuyến nghị hơn cho CSS toàn cục)
// import 'katex/dist/katex.min.css'; 

// Tách ResultDisplay ra thành một component riêng biệt để hiển thị kết quả
const ResultDisplay = ({ result, examData, formatTime }) => {
  // result: dữ liệu kết quả bài thi từ backend (ExamResult document)
  // examData: dữ liệu đề thi đầy đủ từ backend (Exam document)
  if (!result || !examData) {
    console.error("ResultDisplay: result or examData is missing.", { result, examData });
    return (
        <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
            <p>Không thể hiển thị kết quả bài thi. Dữ liệu không đầy đủ hoặc có lỗi.</p>
            <p>Vui lòng thử làm lại bài thi hoặc liên hệ hỗ trợ nếu vấn đề tiếp diễn.</p>
        </div>
    );
  }

  // Sử dụng giá trị 0 nếu result.maxPossibleScore là undefined/null hoặc 0 để tránh chia cho 0
  const actualMaxPossibleScore = result.maxPossibleScore !== undefined && result.maxPossibleScore > 0 ? result.maxPossibleScore : 0;
  // Score cũng cần kiểm tra để tránh .toFixed trên undefined
  const actualScore = result.score !== undefined ? result.score : 0;

  const percentage = actualMaxPossibleScore > 0 ? ((actualScore / actualMaxPossibleScore) * 100).toFixed(0) : 0;
  
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Kết quả Bài thi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Điểm số:</span>
          {/* HIỂN THỊ ĐIỂM SỐ TRÊN TỔNG ĐIỂM TỐI ĐA, SỬ DỤNG default 0 nếu undefined */}
          <span className="text-blue-700 text-2xl font-bold">
            {actualScore.toFixed(2)} / {actualMaxPossibleScore.toFixed(2)}
          </span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Số câu đúng:</span>
          <span className="text-green-700 text-2xl font-bold">{(result.correctAnswersCount || 0)} / {examData.questions.length}</span>
        </div>
        <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Số câu sai:</span>
          <span className="text-red-700 text-2xl font-bold">{(result.incorrectAnswersCount || 0)} / {examData.questions.length}</span>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Thời gian làm bài:</span>
          <span className="text-yellow-700 text-2xl font-bold">{formatTime(result.timeTaken || 0)}</span>
        </div>
      </div>
      
      {/* THAY ĐỔI TẠI ĐÂY: Bọc đoạn văn bản bằng MathContent */}
      <div className="text-center text-lg text-gray-700 mb-8">
        <MathContent content={`Bạn đã hoàn thành bài thi với **${actualScore.toFixed(2)} điểm** (${percentage}%).`} />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Xem lại các câu hỏi và đáp án:</h3>
      <div className="space-y-6">
        {examData.questions.map((q, qIndex) => {
          // Tìm đáp án của người dùng cho câu hỏi này trong mảng userAnswers
          // Đảm bảo result.userAnswers là một mảng trước khi dùng .find
          const userAnswerEntry = (result.userAnswers || []).find(ua => ua.questionId === q._id.toString());
          
          const isQuestionCorrectOverall = userAnswerEntry ? userAnswerEntry.isCorrect : false; // Đúng/Sai tổng thể câu hỏi
          const scoreAchievedForQuestion = userAnswerEntry ? (userAnswerEntry.scoreAchieved || 0) : 0; // Điểm đạt được cho câu hỏi này

          // Lấy điểm tối đa cho câu hỏi này từ scoringConfig của examData
          let maxScoreForThisQuestion = 0;
          if (examData.scoringConfig) {
            switch (q.type) {
              case 'multiple-choice':
                maxScoreForThisQuestion = examData.scoringConfig.multipleChoice || 0;
                break;
              case 'short-answer':
                maxScoreForThisQuestion = examData.scoringConfig.shortAnswer || 0;
                break;
              case 'true-false':
                maxScoreForThisQuestion = examData.scoringConfig.trueFalse && examData.scoringConfig.trueFalse['4'] !== undefined ? examData.scoringConfig.trueFalse['4'] : 0;
                break;
              default:
                maxScoreForThisQuestion = 0;
            }
          }

          // Điều chỉnh màu sắc nền dựa trên đúng/sai tổng thể của câu hỏi (đạt điểm tối đa hay không)
          const questionCardClass = `p-5 rounded-lg border shadow-sm ${
            isQuestionCorrectOverall ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`;

          return (
            <div key={q._id || `q-${qIndex}`} className={questionCardClass}>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} /></h4>
              
              {/* Hiển thị điểm đạt được cho câu hỏi này */}
              <p className="text-gray-700 text-sm mb-3">
                Điểm câu hỏi: <span className="font-bold text-blue-700">
                  {scoreAchievedForQuestion.toFixed(2)} / {maxScoreForThisQuestion.toFixed(2)}
                </span>
              </p>

              {/* PHẦN I: Trắc nghiệm nhiều lựa chọn */}
              {q.type === 'multiple-choice' && (
                <div className="space-y-2 mb-4">
                  {q.options.map((option, optIndex) => {
                    const userAnswer = userAnswerEntry ? userAnswerEntry.userAnswer : ''; // Đáp án của người dùng cho trắc nghiệm
                    const isUserSelected = userAnswer === option;
                    const isCorrectOption = q.multipleChoiceCorrectAnswer === option;

                    // Class cho từng lựa chọn
                    let optionClass = 'flex items-center space-x-3 p-3 rounded-md border text-gray-700 bg-gray-50';
                    if (isCorrectOption) {
                      optionClass = 'flex items-center space-x-3 p-3 rounded-md border font-bold bg-green-100 text-green-800 border-green-400';
                    } else if (isUserSelected && !isCorrectOption) {
                      optionClass = 'flex items-center space-x-3 p-3 rounded-md border font-bold bg-red-100 text-red-800 border-red-400';
                    }

                    return (
                      <div key={optIndex} className={optionClass}>
                        <input
                          type="radio"
                          checked={isUserSelected}
                          disabled
                          className={`h-5 w-5 ${isCorrectOption ? 'text-green-600' : 'text-blue-600'}`}
                        />
                        <span className="text-base">
                          <MathContent content={option} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PHẦN II: Trắc nghiệm Đúng/Sai */}
              {q.type === 'true-false' && (
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700 font-semibold mb-2">Đáp án của bạn cho mỗi ý:</p>
                  {q.statements.map((stmt, stmtIndex) => {
                    // Lấy đáp án hiện tại của người dùng cho ý này
                    const currentUserAnswerForStatement = userAnswers[q._id] ? userAnswers[q._id][stmtIndex] : null;
                    return (
                        <div key={stmtIndex} className="flex items-center space-x-3 p-3 rounded-md border border-gray-300 bg-white">
                            <span className="text-base text-gray-800 flex-grow">
                                {String.fromCharCode(97 + stmtIndex)}) <MathContent content={stmt.statementText} />
                            </span>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${q._id}-statement-${stmtIndex}`} // Đảm bảo unique name cho mỗi cặp radio của ý con
                                        checked={currentUserAnswerForStatement === true}
                                        onChange={() => handleAnswerChange(q._id, true, q.type, stmtIndex)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className={`ml-2 ${currentUserAnswerForStatement === true ? 'font-bold text-blue-800' : 'text-gray-800'}`}>Đúng</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${q._id}-statement-${stmtIndex}`}
                                        checked={currentUserAnswerForStatement === false}
                                        onChange={() => handleAnswerChange(q._id, false, q.type, stmtIndex)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className={`ml-2 ${currentUserAnswerForStatement === false ? 'font-bold text-blue-800' : 'text-gray-800'}`}>Sai</span>
                                </label>
                            </div>
                        </div>
                    );
                  })}
                </div>
              )}

              {/* PHẦN III: Trắc nghiệm Trả lời ngắn */}
              {q.type === 'short-answer' && (
                <div className="mb-4">
                  <p className="text-gray-700 font-semibold mb-2">Đáp án trả lời ngắn:</p>
                  <div className="flex items-center space-x-3 p-3 rounded-md border bg-gray-50">
                    <span className="text-gray-800">
                      Đáp án của bạn: <span className={`${isQuestionCorrectOverall ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>
                         {userAnswerEntry ? userAnswerEntry.userAnswer : ''}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Phần hiển thị giải thích chung cho tất cả các loại */}
              <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800">
                {/* Chỉ hiển thị đáp án đúng nếu đó là trắc nghiệm nhiều lựa chọn hoặc trả lời ngắn */}
                {(q.type === 'multiple-choice' || q.type === 'short-answer') && (
                    <p className="font-semibold mb-2">
                        Đáp án đúng: 
                        <span className="text-green-700 ml-1">
                            <MathContent content={q.type === 'multiple-choice' ? q.multipleChoiceCorrectAnswer : q.shortAnswerCorrectAnswer} />
                        </span>
                    </p>
                )}
                
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

const ExamDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, token, authLoading } = useAuth();

  const [exam, setExam] = useState(null); // Đổi tên examData thành exam cho rõ ràng, nhất quán với backend
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null); // Thông báo lỗi validation
  const [userAnswers, setUserAnswers] = useState({}); // Lưu trữ đáp án người dùng theo questionId
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false); // Đổi tên isExamSubmitted thành examFinished
  const [examResult, setExamResult] = useState(null);
  const [submitting, setSubmitting] = useState(false); 

  const timerRef = useRef(null);

  // Hàm định dạng thời gian (phút:giây)
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Hàm nộp bài thi
  const handleSubmitExam = useCallback(async (isTimeUp = false) => {
    // Sử dụng examFinished thay vì isExamSubmitted
    if (!user || !token || !exam || examFinished || submitting) { 
      if (!user) setError('Bạn cần đăng nhập để nộp bài thi.');
      return;
    }

    // --- BẮT ĐẦU VALIDATION PHÍA CLIENT ---
    let allQuestionsAnswered = true;
    for (const q of exam.questions) {
      const userAnswer = userAnswers[q._id];
      if (q.type === 'multiple-choice') {
        if (!userAnswer || userAnswer === '') {
          setError(`Vui lòng chọn đáp án cho Câu hỏi ${exam.questions.indexOf(q) + 1}.`);
          allQuestionsAnswered = false;
          break; // Dừng vòng lặp ngay khi tìm thấy câu chưa trả lời
        }
      } else if (q.type === 'true-false') {
        // Kiểm tra xem tất cả các ý trong câu Đúng/Sai đã được trả lời chưa (không có null)
        if (!userAnswer || !Array.isArray(userAnswer) || userAnswer.some(ans => ans === null || ans === undefined)) {
          setError(`Vui lòng trả lời đầy đủ các ý trong Câu hỏi ${exam.questions.indexOf(q) + 1}.`);
          allQuestionsAnswered = false;
          break;
        }
      } else if (q.type === 'short-answer') {
        if (!userAnswer || userAnswer.trim() === '') {
          setError(`Vui lòng điền đáp án cho Câu hỏi ${exam.questions.indexOf(q) + 1}.`);
          allQuestionsAnswered = false;
          break;
        }
      }
    }

    if (!allQuestionsAnswered) {
        setSubmitting(false); // Đảm bảo nút không bị disabled
        // Lỗi đã được set trong vòng lặp, không cần set lại ở đây
        return; // Ngăn không cho hàm tiếp tục nộp bài
    }
    // --- KẾT THÚC VALIDATION PHÍA CLIENT ---

    setSubmitting(true);
    setExamFinished(true); // Chỉ set khi bài thi hợp lệ và chuẩn bị nộp
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setError(null); // Xóa lỗi sau khi validation thành công và chuẩn bị nộp

    const timeTaken = exam.duration * 60 - timeRemaining; 
    
    // Chuẩn bị dữ liệu đáp án để gửi lên backend
    const answersToSend = Object.keys(userAnswers).map(questionId => {
        const question = exam.questions.find(q => q._id === questionId);
        let userAnswerValue = userAnswers[questionId];

        // Chuyển đổi dữ liệu userAnswers sang định dạng chuỗi nếu cần cho backend
        // Backend ExamResult model có userAnswer là String, nên ta cần JSON.stringify cho array/object
        if (question && question.type === 'true-false' && Array.isArray(userAnswerValue)) {
            userAnswerValue = JSON.stringify(userAnswerValue);
        }
        // Short-answer và multiple-choice đã là string hoặc rỗng, không cần chuyển đổi
        
        return {
            questionId: questionId,
            userAnswer: userAnswerValue // Đây là giá trị đã được chuẩn hóa (string)
        };
    });

    const submissionData = {
      examId: exam._id,
      userAnswers: answersToSend,
      timeTaken: timeTaken, // Gửi timeTaken thay vì timeSpent để khớp với backend
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-results`, { // Endpoint đúng
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
      setExamResult(resultData);

      // THÊM DÒNG NÀY ĐỂ CUỘN LÊN ĐẦU TRANG
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Lỗi khi nộp bài thi:', err);
      // Giữ examFinished = false và hiển thị lỗi để người dùng có thể thử lại
      setExamFinished(false); 
      setError(err.message || 'Đã xảy ra lỗi khi nộp bài thi.');
    } finally {
      setSubmitting(false);
    }
  }, [user, token, exam, examFinished, userAnswers, timeRemaining, submitting]);

  // Fetch exam details
  useEffect(() => {
    if (!slug || authLoading) {
      return;
    }

    if (!user && !authLoading) {
      setError('Bạn cần đăng nhập để làm bài thi này.');
      return;
    }

    const fetchExam = async () => {
      setLoadingContent(true); 
      setError(null);
      try {
        const fetchHeaders = user && token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/slug/${slug}`, {
          headers: fetchHeaders,
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Đề thi này chưa được xuất bản hoặc bạn không có quyền truy cập.');
          }
          if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          }
          throw new Error(data.message || 'Lỗi khi tải đề thi.');
        }

        setExam(data); // Đặt dữ liệu đề thi vào state 'exam'
        setTimeRemaining(data.duration * 60);

        // Khởi tạo userAnswers dựa trên loại câu hỏi
        const initialAnswers = {};
        data.questions.forEach(q => {
          if (q.type === 'multiple-choice') {
            initialAnswers[q._id] = ''; // Chuỗi rỗng cho trắc nghiệm
          } else if (q.type === 'true-false') {
            // Khởi tạo mảng null cho 4 ý của câu hỏi Đúng/Sai (mặc định không chọn gì)
            initialAnswers[q._id] = [null, null, null, null]; 
          } else if (q.type === 'short-answer') {
            initialAnswers[q._id] = ''; // Chuỗi rỗng cho trả lời ngắn
          }
        });
        setUserAnswers(initialAnswers);

      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải đề thi.');
      } finally {
        setLoadingContent(false);
      }
    };
    fetchExam();
  }, [slug, authLoading, user, token]);

  // Start timer when exam starts
  useEffect(() => {
    if (examStarted && !examFinished && timeRemaining > 0 && typeof window !== 'undefined') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam(true); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted, examFinished, handleSubmitExam, timeRemaining]); // Thêm timeRemaining vào dependencies

  // Xử lý khi user thay đổi đáp án
  const handleAnswerChange = useCallback((questionId, value, questionType, statementIndex = null) => {
    if (!examFinished) {
      setUserAnswers(prevAnswers => {
        const newAnswers = { ...prevAnswers };
        if (questionType === 'multiple-choice' || questionType === 'short-answer') {
          newAnswers[questionId] = value;
        } else if (questionType === 'true-false') {
          // Đối với Đúng/Sai, value là boolean (true/false) cho ý cụ thể
          const currentStatementsAnswers = [...(newAnswers[questionId] || [null, null, null, null])]; // Đảm bảo khởi tạo với null
          currentStatementsAnswers[statementIndex] = value;
          newAnswers[questionId] = currentStatementsAnswers;
        }
        return newAnswers;
      });
      setError(null); // Xóa lỗi validation khi người dùng thay đổi đáp án
    }
  }, [examFinished]);

  // If authLoading is done and no user (after fetching exam is done or error)
  if (!user && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold mb-4">Bạn cần đăng nhập để làm bài thi này.</p>
        <Link href="/login">
          <a className="btn-primary">Đăng nhập ngay</a>
        </Link>
      </div>
    );
  }

  // Display fetch error if any (this error is from initial data fetch, not validation)
  if (error && !examStarted) { // Chỉ hiển thị lỗi toàn trang nếu chưa bắt đầu thi
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 text-center font-semibold">Đã xảy ra lỗi: {error}</p>
        <p className="text-md text-gray-600 text-center mt-2">Vui lòng thử lại hoặc <Link href="/tests"><a className="text-blue-600 hover:underline">quay về danh sách đề thi</a></Link>.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Head>
        <title>{exam ? exam.title : 'Đề thi'} - Đề thi Online</title>
        <meta name="description" content={exam ? exam.description : 'Trang làm bài thi Vật lý online'} />
      </Head>

      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/tests">
            <a className="hover:underline text-blue-600">Đề thi Online</a>
          </Link>
          <span className="mx-2">/</span>
          <span>{exam ? exam.title : '...'}</span>
        </nav>

        {loadingContent ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">Đang tải đề thi...</p>
          </div>
        ) : !exam ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-700">
            <p className="text-xl text-center">Không tìm thấy đề thi này.</p>
            <Link href="/tests">
                <a className="mt-4 btn-primary">Quay về danh sách đề thi</a>
            </Link>
          </div>
        ) : examFinished && examResult ? (
          // Truyền exam (data đề thi) và examResult (kết quả đã nộp)
          <ResultDisplay result={examResult} examData={exam} formatTime={formatTime} />
        ) : (
          <>
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
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Chưa xuất bản
                </span>
              )}
            </div>
            
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
                {/* HIỂN THỊ LỖI VALIDATION TẠI ĐÂY */}
                {error && ( // Chỉ hiển thị lỗi nếu có
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Các câu hỏi:</h2>
                {exam.questions && exam.questions.length > 0 ? (
                  <div className="space-y-6">
                    {exam.questions.map((q, qIndex) => (
                      <div key={q._id || `q-${qIndex}`} className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} />
                        </h3>
                        
                        {/* Hiển thị phần nhập liệu theo loại câu hỏi */}
                        {/* PHẦN I: Trắc nghiệm nhiều lựa chọn */}
                        {q.type === 'multiple-choice' && q.options && q.options.length > 0 && (
                          <div className="space-y-2">
                            {q.options.map((option, optIndex) => (
                              <label
                                key={optIndex}
                                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-50
                                  ${userAnswers[q._id] === option ? 'bg-blue-100 border border-blue-300' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q._id}`} // Dùng q._id để nhóm radio buttons
                                  value={option}
                                  checked={userAnswers[q._id] === option}
                                  onChange={() => handleAnswerChange(q._id, option, q.type)}
                                  className="form-radio h-5 w-5 text-blue-600 cursor-pointer"
                                />
                                <span className="text-base text-gray-800">
                                  <MathContent content={option} />
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* PHẦN II: Trắc nghiệm Đúng/Sai */}
                        {q.type === 'true-false' && q.statements && q.statements.length === 4 && (
                            <div className="space-y-2">
                                <p className="text-gray-700 font-semibold mb-2">Chọn Đúng hoặc Sai cho mỗi ý:</p>
                                {q.statements.map((stmt, stmtIndex) => {
                                    // Lấy đáp án hiện tại của người dùng cho ý này
                                    const currentUserAnswerForStatement = userAnswers[q._id] ? userAnswers[q._id][stmtIndex] : null;
                                    return (
                                        <div key={stmtIndex} className="flex items-center space-x-3 p-3 rounded-md border border-gray-300 bg-white">
                                            <span className="text-base text-gray-800 flex-grow">
                                                {String.fromCharCode(97 + stmtIndex)}) <MathContent content={stmt.statementText} />
                                            </span>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q._id}-statement-${stmtIndex}`} // Đảm bảo unique name cho mỗi cặp radio của ý con
                                                        checked={currentUserAnswerForStatement === true}
                                                        onChange={() => handleAnswerChange(q._id, true, q.type, stmtIndex)}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className={`ml-2 ${currentUserAnswerForStatement === true ? 'font-bold text-blue-800' : 'text-gray-800'}`}>Đúng</span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q._id}-statement-${stmtIndex}`}
                                                        checked={currentUserAnswerForStatement === false}
                                                        onChange={() => handleAnswerChange(q._id, false, q.type, stmtIndex)}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className={`ml-2 ${currentUserAnswerForStatement === false ? 'font-bold text-blue-800' : 'text-gray-800'}`}>Sai</span>
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* PHẦN III: Trắc nghiệm Trả lời ngắn */}
                        {q.type === 'short-answer' && (
                            <div className="mb-4">
                                <label htmlFor={`short-answer-${q._id}`} className="block text-gray-700 font-semibold mb-2">Điền đáp án:</label>
                                <input
                                    id={`short-answer-${q._id}`}
                                    type="text"
                                    value={userAnswers[q._id] || ''}
                                    onChange={(e) => handleAnswerChange(q._id, e.target.value, q.type)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                                    placeholder="Điền đáp án (tối đa 4 ký tự: 0-9, -, ,)"
                                    maxLength="4"
                                    pattern="^[0-9,-]*$" // Client-side validation regex
                                />
                                <p className="mt-1 text-xs text-gray-500">Chỉ chấp nhận số (0-9), dấu "-" và dấu ",". Tối đa 4 ký tự.</p>
                            </div>
                        )}
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
