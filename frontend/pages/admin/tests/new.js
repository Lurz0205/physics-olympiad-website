// physics-olympiad-website/frontend/pages/admin/tests/new.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext'; 

const AddNewExamPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60); 
  const [category, setCategory] = useState('TỔNG HỢP');
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState([]); // Mảng các câu hỏi, mỗi object sẽ có 'type'
  
  // State để quản lý loại câu hỏi đang được thêm vào (dùng cho form thêm câu hỏi mới)
  const [newQuestionType, setNewQuestionType] = useState('multiple-choice'); 

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['TỔNG HỢP', 'CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];

  const generateSlug = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // Hàm để thêm một câu hỏi mới vào danh sách
  const addQuestion = () => {
    let newQ = { questionText: '', explanation: '' };
    if (newQuestionType === 'multiple-choice') {
      newQ = { ...newQ, type: 'multiple-choice', options: ['', '', '', ''], multipleChoiceCorrectAnswer: '' };
    } else if (newQuestionType === 'true-false') {
      newQ = { ...newQ, type: 'true-false', statements: [
        { statementText: '', isCorrect: true },
        { statementText: '', isCorrect: true },
        { statementText: '', isCorrect: true },
        { statementText: '', isCorrect: true },
      ]};
    } else if (newQuestionType === 'short-answer') {
      newQ = { ...newQ, type: 'short-answer', shortAnswerCorrectAnswer: '' };
    }
    setQuestions([...questions, newQ]);
  };

  // Hàm để xóa một câu hỏi
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi nội dung câu hỏi (chung cho questionText, explanation)
  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi lựa chọn cho Multiple Choice
  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi đáp án đúng cho Multiple Choice
  const handleMultipleChoiceAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].multipleChoiceCorrectAnswer = value;
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi nội dung ý con cho True/False
  const handleStatementTextChange = (qIndex, stmtIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].statements[stmtIndex].statementText = value;
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi đáp án Đúng/Sai cho ý con của True/False
  const handleStatementIsCorrectChange = (qIndex, stmtIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].statements[stmtIndex].isCorrect = value;
    setQuestions(newQuestions);
  };

  // Hàm xử lý thay đổi đáp án cho Short Answer
  const handleShortAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].shortAnswerCorrectAnswer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    if (!title.trim() || !slug.trim() || !category.trim() || duration <= 0) {
      setError('Vui lòng điền đầy đủ Tiêu đề, Slug, Danh mục, và Thời lượng.');
      setSubmitting(false);
      return;
    }

    if (questions.length === 0) {
      setError('Đề thi phải có ít nhất một câu hỏi.');
      setSubmitting(false);
      return;
    }

    // Client-side validation cho từng loại câu hỏi
    for (const q of questions) {
      if (!q.questionText || q.questionText.trim() === '') {
        setError('Nội dung câu hỏi không được để trống.');
        setSubmitting(false);
        return;
      }

      switch (q.type) {
        case 'multiple-choice':
          if (!q.options || q.options.filter(opt => opt.trim() !== '').length < 2 || !q.multipleChoiceCorrectAnswer || q.multipleChoiceCorrectAnswer.trim() === '') {
            setError('Mỗi câu hỏi trắc nghiệm phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
            setSubmitting(false);
            return;
          }
          if (!q.options.map(opt => opt.toLowerCase().trim()).includes(q.multipleChoiceCorrectAnswer.toLowerCase().trim())) {
            setError(`Đáp án đúng "${q.multipleChoiceCorrectAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
            setSubmitting(false);
            return;
          }
          break;
        case 'true-false':
          if (!q.statements || q.statements.length !== 4) {
            setError('Câu hỏi Đúng/Sai phải có đúng 4 ý.');
            setSubmitting(false);
            return;
          }
          for (const stmt of q.statements) {
            if (!stmt.statementText || stmt.statementText.trim() === '') {
              setError('Nội dung của một ý trong câu hỏi Đúng/Sai không được để trống.');
              setSubmitting(false);
              return;
            }
            if (typeof stmt.isCorrect !== 'boolean') {
              setError('Đáp án Đúng/Sai cho mỗi ý phải là Đúng hoặc Sai.');
              setSubmitting(false);
              return;
            }
          }
          break;
        case 'short-answer':
          if (!q.shortAnswerCorrectAnswer || q.shortAnswerCorrectAnswer.trim() === '') {
            setError('Vui lòng cung cấp đáp án cho câu hỏi trả lời ngắn.');
            setSubmitting(false);
            return;
          }
          if (!/^[0-9,-]{1,4}$/.test(q.shortAnswerCorrectAnswer.trim())) {
            setError('Đáp án trả lời ngắn phải có tối đa 4 ký tự và chỉ chứa số (0-9), dấu "-" và dấu ",".');
            setSubmitting(false);
            return;
          }
          break;
        default:
          setError('Loại câu hỏi không hợp lệ.');
          setSubmitting(false);
          return;
      }
    }

    try {
      const examData = {
        title,
        slug,
        description: description.trim(),
        duration: parseInt(duration, 10),
        category,
        isPublished,
        questions, // Gửi mảng câu hỏi đã có cấu trúc type mới
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error on adding exam:', data);
        throw new Error(data.message || 'Lỗi khi thêm đề thi.');
      }

      setSuccess('Thêm đề thi mới thành công!');
      // Reset form
      setTitle('');
      setSlug('');
      setDescription('');
      setDuration(60);
      setCategory('TỔNG HỢP');
      setIsPublished(false);
      setQuestions([]);
      setNewQuestionType('multiple-choice'); // Reset loại câu hỏi đang thêm về mặc định

      setTimeout(() => {
        router.push('/admin/tests');
      }, 2000);

    } catch (err) {
      console.error('Error adding exam:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Thêm Đề thi Mới - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Thêm Đề thi Mới</h2>
          <Link href="/admin/tests">
            <a className="btn-secondary">Quay lại Danh sách</a>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tiêu đề */}
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Tiêu đề Đề thi:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập tiêu đề đề thi (ví dụ: Đề thi thử Quốc gia 2024)"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-gray-700 text-sm font-medium mb-2">Slug:</label>
            <input
              type="text"
              id="slug"
              value={slug}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 cursor-not-allowed"
              readOnly
              required
            />
            <p className="mt-1 text-xs text-gray-500">Slug sẽ tự động tạo từ tiêu đề và dùng cho URL.</p>
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Mô tả Đề thi (tùy chọn):</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Mô tả ngắn gọn về đề thi, số lượng câu hỏi, chủ đề bao gồm..."
            ></textarea>
          </div>

          {/* Thời gian làm bài */}
          <div>
            <label htmlFor="duration" className="block text-gray-700 text-sm font-medium mb-2">Thời gian làm bài (phút):</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Danh mục */}
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-2">Danh mục:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Trạng thái Xuất bản */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-gray-700 text-sm font-medium">Xuất bản đề thi (Hiển thị công khai)</label>
          </div>

          {/* ========================================================= */}
          {/* PHẦN QUẢN LÝ CÂU HỎI CỦA ĐỀ THI */}
          {/* ========================================================= */}
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Các câu hỏi của Đề thi:</h3>
            
            {questions.length === 0 && (
                <p className="text-center text-gray-600">Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
            )}

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded-lg bg-white shadow-sm space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Xóa câu hỏi này"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                {/* Loại câu hỏi hiển thị */}
                <p className="text-sm text-gray-500 mb-2">
                    Loại: <span className="font-semibold text-indigo-700">
                        {q.type === 'multiple-choice' && 'Trắc nghiệm nhiều lựa chọn'}
                        {q.type === 'true-false' && 'Đúng / Sai'}
                        {q.type === 'short-answer' && 'Trả lời ngắn'}
                    </span>
                </p>

                {/* Nội dung câu hỏi (chung) */}
                <label className="block text-gray-700 text-sm font-medium mb-1">Nội dung câu hỏi {qIndex + 1}:</label>
                <textarea
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Nhập nội dung câu hỏi (hỗ trợ Markdown & LaTeX)"
                  required
                ></textarea>

                {/* Phần riêng cho Multiple Choice */}
                {q.type === 'multiple-choice' && (
                  <>
                    <label className="block text-gray-700 text-sm font-medium mb-1 mt-3">Các lựa chọn (ít nhất 2):</label>
                    {q.options.map((option, optIndex) => (
                      <input
                        key={optIndex}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder={`Lựa chọn ${optIndex + 1} (hỗ trợ Markdown & LaTeX)`}
                        required={optIndex < 2} // Chỉ yêu cầu 2 lựa chọn đầu tiên
                      />
                    ))}
                    
                    <label className="block text-gray-700 text-sm font-medium mb-1">Đáp án đúng (phải khớp với một lựa chọn):</label>
                    <input
                      type="text"
                      value={q.multipleChoiceCorrectAnswer}
                      onChange={(e) => handleMultipleChoiceAnswerChange(qIndex, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập đáp án đúng"
                      required
                    />
                  </>
                )}

                {/* Phần riêng cho True/False */}
                {q.type === 'true-false' && (
                  <>
                    <label className="block text-gray-700 text-sm font-medium mb-1 mt-3">Các ý Đúng/Sai (Điền đủ 4 ý):</label>
                    {q.statements.map((stmt, stmtIndex) => (
                      <div key={stmtIndex} className="flex items-center space-x-2 mb-2">
                        <textarea
                          value={stmt.statementText}
                          onChange={(e) => handleStatementTextChange(qIndex, stmtIndex, e.target.value)}
                          rows="1"
                          className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder={`Ý ${stmtIndex + 1} (hỗ trợ Markdown & LaTeX)`}
                          required
                        ></textarea>
                        <select
                          value={stmt.isCorrect}
                          onChange={(e) => handleStatementIsCorrectChange(qIndex, stmtIndex, e.target.value === 'true')}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                          <option value={true}>Đúng</option>
                          <option value={false}>Sai</option>
                        </select>
                      </div>
                    ))}
                  </>
                )}

                {/* Phần riêng cho Short Answer */}
                {q.type === 'short-answer' && (
                  <>
                    <label className="block text-gray-700 text-sm font-medium mb-1 mt-3">Đáp án trả lời ngắn:</label>
                    <input
                      type="text"
                      value={q.shortAnswerCorrectAnswer}
                      onChange={(e) => handleShortAnswerChange(qIndex, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Đáp án (số 0-9, '-', ',' tối đa 4 ký tự)"
                      maxLength="4"
                      pattern="^[0-9,-]*$"
                      required
                    />
                     <p className="mt-1 text-xs text-gray-500">Chỉ chấp nhận số (0-9), dấu "-" và dấu ",". Tối đa 4 ký tự.</p>
                  </>
                )}

                <label className="block text-gray-700 text-sm font-medium mb-1">Giải thích (tùy chọn):</label>
                <textarea
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Giải thích chi tiết đáp án (hỗ trợ Markdown & LaTeX)"
                ></textarea>
              </div>
            ))}
            
            {/* Lựa chọn loại câu hỏi để thêm mới */}
            <div className="flex items-center justify-between gap-4 mt-6 p-3 bg-white rounded-lg shadow-inner">
                <label htmlFor="newQuestionType" className="block text-gray-700 text-sm font-medium">Thêm loại câu hỏi:</label>
                <select
                    id="newQuestionType"
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                    <option value="multiple-choice">Trắc nghiệm nhiều lựa chọn</option>
                    <option value="true-false">Đúng / Sai</option>
                    <option value="short-answer">Trả lời ngắn</option>
                </select>
                <button
                    type="button"
                    onClick={addQuestion}
                    className="btn-primary flex items-center justify-center gap-2 px-4 py-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Thêm
                </button>
            </div>
          </div>
          {/* ========================================================= */}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Đang thêm đề thi...' : 'Thêm Đề thi Mới'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewExamPage;
