// physics-olympiad-website/frontend/pages/admin/tests/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext'; // Sửa đường dẫn nếu cần

const EditExamPage = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy ID đề thi từ URL
  const { token, user } = useAuth(); // Lấy token và user để xác thực

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('TỔNG HỢP');
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true); // Loading khi tải dữ liệu đề thi
  const [submitting, setSubmitting] = useState(false); // Loading khi submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['TỔNG HỢP', 'CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];

  // Chuyển hướng nếu không phải admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/login'); // Hoặc trang lỗi
    }
  }, [user, router]);

  // Hàm tải dữ liệu đề thi khi ID và token có sẵn
  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const fetchExam = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải dữ liệu đề thi.');
        }

        // Điền dữ liệu vào state
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || '');
        setDuration(data.duration);
        setCategory(data.category);
        setIsPublished(data.isPublished);
        setQuestions(data.questions || []); // Đảm bảo là mảng

      } catch (err) {
        console.error('Lỗi khi tải đề thi:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu đề thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, token]); // Chạy lại khi ID hoặc token thay đổi

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
    // Chỉ tự động cập nhật slug nếu slug chưa được sửa thủ công
    // Hoặc nếu slug hiện tại khớp với slug tự động từ tiêu đề cũ
    if (!slug || generateSlug(newTitle) === slug) {
        setSlug(generateSlug(newTitle));
    }
  };

  // =========================================================
  // LOGIC QUẢN LÝ CÂU HỎI TRẮC NGHIỆM CON (Tương tự new.js)
  // =========================================================

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    // Client-side validation
    if (!title.trim() || !slug.trim() || duration <= 0 || !category.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Thời gian, Danh mục).');
      setSubmitting(false);
      return;
    }

    if (questions.length === 0) {
      setError('Đề thi phải có ít nhất một câu hỏi.');
      setSubmitting(false);
      return;
    }

    for (const q of questions) {
      if (!q.questionText.trim()) {
        setError('Nội dung của một câu hỏi không được để trống.');
        setSubmitting(false);
        return;
      }
      const filledOptions = q.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        setError(`Mỗi câu hỏi phải có ít nhất 2 lựa chọn đã điền.`);
        setSubmitting(false);
        return;
      }
      if (!q.correctAnswer.trim()) {
        setError(`Vui lòng chọn đáp án đúng cho một câu hỏi.`);
        setSubmitting(false);
        return;
      }
      if (!filledOptions.includes(q.correctAnswer)) {
        setError(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho câu hỏi "${q.questionText.substring(0, 50)}..."`);
        setSubmitting(false);
        return;
      }
    }

    try {
      const examData = {
        title,
        slug,
        description: description.trim(),
        duration: Number(duration),
        category,
        isPublished,
        questions,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${id}`, {
        method: 'PUT', // Dùng PUT để cập nhật
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error on updating exam:', data);
        throw new Error(data.message || 'Lỗi khi cập nhật đề thi.');
      }

      setSuccess('Cập nhật đề thi thành công!');
      // Tùy chọn: chuyển hướng về danh sách đề thi sau một thời gian
      setTimeout(() => {
        router.push('/admin/tests');
      }, 2000);

    } catch (err) {
      console.error('Error updating exam:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null; // AdminLayout đã xử lý chuyển hướng
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải dữ liệu đề thi...</p>
        </div>
      </div>
    );
  }

  if (error && !submitting) { // Chỉ hiển thị lỗi tải dữ liệu, không phải lỗi submit
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        Lỗi: {error}
        <Link href="/admin/tests">
            <a className="ml-4 text-blue-800 hover:underline">Quay lại danh sách</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chỉnh sửa Đề thi - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Chỉnh sửa Đề thi</h2>
          <Link href="/admin/tests">
            <a className="btn-secondary">Quay lại Danh sách</a>
          </Link>
        </div>

        {error && submitting && (
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
          {/* Tiêu đề Đề thi */}
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

          {/* Slug (tự động tạo, có thể sửa) */}
          <div>
            <label htmlFor="slug" className="block text-gray-700 text-sm font-medium mb-2">Slug:</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)} // Cho phép sửa slug thủ công
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Slug sẽ tự động tạo từ tiêu đề hoặc có thể chỉnh sửa thủ công.</p>
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
          {/* PHẦN QUẢN LÝ CÂU HỎI TRẮC NGHIỆM CỦA ĐỀ THI */}
          {/* ========================================================= */}
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Các câu hỏi của Đề thi:</h3>
            {questions.length === 0 && (
                <p className="text-center text-gray-600">Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
            )}
            {questions.map((q, qIndex) => (
              <div key={q._id || qIndex} className="border p-4 rounded-lg bg-white shadow-sm space-y-3 relative">
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
                <label className="block text-gray-700 text-sm font-medium mb-1">Nội dung câu hỏi {qIndex + 1}:</label>
                <textarea
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Nhập nội dung câu hỏi (hỗ trợ Markdown & LaTeX)"
                  required
                ></textarea>

                <label className="block text-gray-700 text-sm font-medium mb-1">Các lựa chọn (ít nhất 2):</label>
                {q.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder={`Lựa chọn ${optIndex + 1} (hỗ trợ Markdown & LaTeX)`}
                    required // Yêu cầu điền đủ 4 options
                  />
                ))}
                
                <label className="block text-gray-700 text-sm font-medium mb-1">Đáp án đúng:</label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Nhập đáp án đúng (phải khớp với một trong các lựa chọn)"
                  required
                />

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
            <button
              type="button"
              onClick={addQuestion}
              className="btn-secondary w-full flex items-center justify-center gap-2 mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Thêm Câu hỏi vào Đề thi
            </button>
          </div>
          {/* ========================================================= */}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật Đề thi...' : 'Cập nhật Đề thi'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditExamPage;
