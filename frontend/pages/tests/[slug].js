// frontend/pages/tests/[slug].js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import MathContent from '../../components/MathContent'; // Component để render Markdown/LaTeX

// Tách ResultDisplay ra thành một component riêng biệt để hiển thị kết quả
const ResultDisplay = ({ result, examData, formatTime }) => {
  if (!result || !examData) return null;

  // Tính phần trăm điểm dựa trên thang điểm 10 của backend
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
          // Tìm đáp án của người dùng cho câu hỏi này
          const userAnswerEntry = result.userAnswers.find(ua => ua.questionId === q._id);
          const isCorrectQuestionOverall = userAnswerEntry ? userAnswerEntry.isCorrect : false; // Đúng/Sai tổng thể câu hỏi

          // Điều chỉnh màu sắc nền dựa trên tổng thể câu hỏi đúng/sai
          const questionCardClass = `p-5 rounded-lg border shadow-sm ${
            isCorrectQuestionOverall ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`;

          return (
            <div key={q._id || `q-${qIndex}`} className={questionCardClass}>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Câu hỏi {qIndex + 1}: <MathContent content={q.questionText} /></h4>
              
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
                  <p className="text-gray-700 font-semibold mb-2">Chọn Đúng hoặc Sai cho mỗi ý:</p>
                  {q.statements.map((stmt, stmtIndex) => {
                    // Lấy đáp án của người dùng cho từng ý
                    const userStatementAnswer = userAnswerEntry && userAnswerEntry.userAnswer 
                                                ? JSON.parse(userAnswerEntry.userAnswer)[stmtIndex] 
                                                : null; 
                    const isCorrectStatement = stmt.isCorrect === userStatementAnswer;

                    // Class cho từng ý Đúng/Sai
                    let statementClass = 'flex items-center space-x-3 p-3 rounded-md border';
                    if (isCorrectStatement) {
                      statementClass += ' bg-green-100 border-green-300';
                    } else {
                      statementClass += ' bg-red-100 border-red-300';
                    }

                    return (
                      <div key={stmtIndex} className={statementClass}>
                        <span className="text-base text-gray-800 mr-2">
                          Ý {String.fromCharCode(97 + stmtIndex)}. <MathContent content={stmt.statementText} />
                        </span>
                        <div className="flex-grow flex justify-end items-center space-x-4">
                          <span className={`${stmt.isCorrect ? 'font-bold text-green-700' : 'text-gray-500'}`}>
                            Đúng (ĐA)
                          </span>
                          <input type="radio" checked={stmt.isCorrect === true} disabled className="h-5 w-5 text-green-600" />
                          
                          <span className={`${!stmt.isCorrect ? 'font-bold text-red-700' : 'text-gray-500'}`}>
                            Sai (ĐA)
                          </span>
                          <input type="radio" checked={stmt.isCorrect === false} disabled className="h-5 w-5 text-red-600" />
                          
                          <span className="ml-4 text-gray-700">|</span>

                          <span className={`${userStatementAnswer === true ? (isCorrectStatement ? 'font-bold text-green-700' : 'font-bold text-red-700') : 'text-gray-500'}`}>
                            Đúng (Bạn)
                          </span>
                          <input type="radio" checked={userStatementAnswer === true} disabled className="h-5 w-5 text-blue-600" />

                          <span className={`${userStatementAnswer === false ? (isCorrectStatement ? 'font-bold text-green-700' : 'font-bold text-red-700') : 'text-gray-500'}`}>
                            Sai (Bạn)
                          </span>
                          <input type="radio" checked={userStatementAnswer === false} disabled className="h-5 w-5 text-blue-600" />
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
                      Đáp án của bạn: <span className={`${isCorrectQuestionOverall ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>
                         {userAnswerEntry ? userAnswerEntry.userAnswer : ''}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Phần hiển thị đáp án đúng và giải thích chung cho tất cả các loại */}
              <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800">
                {q.type === 'multiple-choice' && (
                    <p className="font-semibold mb-2">Đáp án đúng: <span className="text-green-700"><MathContent content={q.multipleChoiceCorrectAnswer} /></span></p>
                )}
                {q.type === 'short-answer' && (
                    <p className="font-semibold mb-2">Đáp án đúng: <span className="text-green-700"><MathContent content={q.shortAnswerCorrectAnswer} /></span></p>
                )}
                {/* Đối với True/False, đáp án đúng đã được hiển thị chi tiết ở từng ý */}
                
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

  const [exam, setExam] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // Lưu trữ đáp án người dùng theo questionId
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
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
    if (!user || !token || !exam || examFinished || submitting) {
      if (!user) setError('Bạn cần đăng nhập để nộp bài thi.');
      return;
    }

    setSubmitting(true);
    setExamFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setError(null);

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
      setExamResult(resultData);
    } catch (err) {
      console.error('Lỗi khi nộp bài thi:', err);
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

        setExam(data);
        setTimeRemaining(data.duration * 60);

        // Khởi tạo userAnswers dựa trên loại câu hỏi
        const initialAnswers = {};
        data.questions.forEach(q => {
          if (q.type === 'multiple-choice') {
            initialAnswers[q._id] = ''; // Chuỗi rỗng cho trắc nghiệm
          } else if (q.type === 'true-false') {
            // Khởi tạo mảng boolean cho 4 ý của câu hỏi Đúng/Sai
            initialAnswers[q._id] = [false, false, false, false]; 
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
          const currentStatementsAnswers = [...(newAnswers[questionId] || [false, false, false, false])];
          currentStatementsAnswers[statementIndex] = value;
          newAnswers[questionId] = currentStatementsAnswers;
        }
        return newAnswers;
      });
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

  // Display fetch error if any
  if (error) {
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
                <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-semibold">
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
                                                Ý {String.fromCharCode(97 + stmtIndex)}. <MathContent content={stmt.statementText} />
                                            </span>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q._id}-statement-${stmtIndex}`} // Đảm bảo unique name cho mỗi cặp radio của ý con
                                                        checked={currentUserAnswerForStatement === true}
                                                        onChange={() => handleAnswerChange(q._id, true, q.type, stmtIndex)}
                                                        className="form-radio h-4 w-4 text-green-600"
                                                    />
                                                    <span className="ml-2 text-gray-800">Đúng</span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q._id}-statement-${stmtIndex}`}
                                                        checked={currentUserAnswerForStatement === false}
                                                        onChange={() => handleAnswerChange(q._id, false, q.type, stmtIndex)}
                                                        className="form-radio h-4 w-4 text-red-600"
                                                    />
                                                    <span className="ml-2 text-gray-800">Sai</span>
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
