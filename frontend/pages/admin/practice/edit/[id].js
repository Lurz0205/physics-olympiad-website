// physics-olympiad-website/frontend/pages/admin/practice/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';

const EditExercisePage = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy ID bài tập từ URL
  const { token } = useAuth(); // Chỉ cần token để xác thực, AdminLayout đã kiểm tra user.role

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState('CƠ HỌC');
  const [difficulty, setDifficulty] = useState('Trung bình');
  const [tags, setTags] = useState('');
  const [type, setType] = useState('Tự luận'); // MỚI: Loại bài tập
  const [questions, setQuestions] = useState([]); // MỚI: Mảng các câu hỏi con (cho Trắc nghiệm)


  const [loading, setLoading] = useState(true); // Loading khi tải dữ liệu bài tập
  const [submitting, setSubmitting] = useState(false); // Loading khi submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];
  const difficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  // LOẠI BỎ: Chuyển hướng nếu không phải admin (AdminLayout đã xử lý)
  // useEffect(() => {
  //   if (user && user.role !== 'admin') {
  //     router.push('/admin'); // Hoặc trang lỗi
  //   }
  // }, [user, router]);

  // Hàm tải dữ liệu bài tập khi ID có sẵn
  useEffect(() => {
    if (!id || !token) { // Chỉ fetch khi có ID và token
      setLoading(false);
      return;
    }

    const fetchExercise = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Gửi token để xác thực
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi tải dữ liệu bài tập.');
        }

        // Điền dữ liệu vào state
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || '');
        setProblemStatement(data.problemStatement);
        setSolution(data.solution || '');
        setCategory(data.category);
        setDifficulty(data.difficulty);
        setTags(data.tags ? data.tags.join(', ') : ''); // Chuyển mảng tags thành chuỗi
        setType(data.type || 'Tự luận'); // Đảm bảo có type, mặc định Tự luận
        setQuestions(data.questions || []); // Đảm bảo có questions, mặc định mảng rỗng

      } catch (err) {
        console.error('Lỗi khi tải bài tập:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu bài tập.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id, token]); // Chạy lại khi ID hoặc token thay đổi

  // Hàm tạo slug từ tiêu đề
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

  // Cập nhật tiêu đề và tự động tạo slug (nếu slug chưa được sửa thủ công)
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Chỉ tự động cập nhật slug nếu slug hiện tại được tạo từ tiêu đề cũ
    // hoặc nếu trường slug đang trống/chưa bị thay đổi thủ công
    if (slug === generateSlug(title) || slug === '') { // Hoặc dùng một flag isSlugManuallyEdited
      setSlug(generateSlug(newTitle));
    }
  };

  // MỚI: Xử lý thêm câu hỏi trắc nghiệm
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
  };

  // MỚI: Xử lý xóa câu hỏi trắc nghiệm
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // MỚI: Xử lý thay đổi nội dung câu hỏi trắc nghiệm
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index][field] = value.split(',').map(item => item.trim());
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  // MỚI: Xử lý thay đổi lựa chọn (option) của câu hỏi trắc nghiệm
  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    // Client-side validation cơ bản
    if (!title.trim() || !slug.trim() || !problemStatement.trim() || !category.trim() || !difficulty.trim() || !type.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đề bài, Danh mục, Độ khó, Loại bài tập).');
      setSubmitting(false);
      return;
    }

    // Validation riêng cho bài tập trắc nghiệm
    if (type === 'Trắc nghiệm') {
      if (questions.length === 0) {
        setError('Bài tập trắc nghiệm phải có ít nhất một câu hỏi.');
        setSubmitting(false);
        return;
      }
      for (const q of questions) {
        if (!q.questionText.trim() || q.options.filter(opt => opt.trim() !== '').length < 2 || !q.correctAnswer.trim()) {
          setError('Mỗi câu hỏi trắc nghiệm phải có nội dung, ít nhất 2 lựa chọn và đáp án đúng.');
          setSubmitting(false);
          return;
        }
        if (!q.options.includes(q.correctAnswer)) {
          setError(`Đáp án đúng "${q.correctAnswer}" không phải là một lựa chọn hợp lệ cho một câu hỏi.`);
          setSubmitting(false);
          return;
        }
      }
    }

    try {
      const exerciseData = {
        title,
        slug,
        description: description.trim(),
        problemStatement,
        solution: type === 'Tự luận' ? solution.trim() : '', // Chỉ gửi solution nếu là Tự luận
        category,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        type, // Gửi loại bài tập
        questions: type === 'Trắc nghiệm' ? questions : [], // Chỉ gửi questions nếu là Trắc nghiệm
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises/${id}`, {
        method: 'PUT', // Dùng PUT để cập nhật
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(exerciseData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error on updating exercise:', data);
        throw new Error(data.message || 'Lỗi khi cập nhật bài tập.');
      }

      setSuccess('Cập nhật bài tập thành công!');
      setTimeout(() => {
        router.push('/admin/practice');
      }, 2000);

    } catch (err) {
      console.error('Error updating exercise:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setSubmitting(false);
    }
  };

  // LOẠI BỎ: if (!user || user.role !== 'admin') { return null; }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải dữ liệu bài tập...</p>
        </div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        Lỗi: {error}
        <Link href="/admin/practice">
            <a className="ml-4 text-blue-800 hover:underline">Quay lại danh sách</a>
        </Link>
      </div>
    );
  }


  return (
    <>
      <Head>
        <title>Chỉnh sửa Bài tập - Admin</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Chỉnh sửa Bài tập</h2>
          <Link href="/admin/practice">
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
          {/* Tiêu đề */}
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Tiêu đề Bài tập:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập tiêu đề bài tập"
              required
            />
          </div>

          {/* Slug (tự động tạo, có thể sửa thủ công) */}
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

          {/* Loại Bài tập */}
          <div>
            <label htmlFor="type" className="block text-gray-700 text-sm font-medium mb-2">Loại Bài tập:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === 'Tự luận') {
                  setQuestions([]);
                } else {
                  setSolution('');
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="Tự luận">Tự luận</option>
              <option value="Trắc nghiệm">Trắc nghiệm</option>
            </select>
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Mô tả ngắn gọn:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Mô tả ngắn gọn về bài tập (không bắt buộc)"
            ></textarea>
          </div>

          {/* Đề bài */}
          <div>
            <label htmlFor="problemStatement" className="block text-gray-700 text-sm font-medium mb-2">Đề bài (hỗ trợ Markdown & LaTeX):</label>
            <textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows="10"
              className="w-full p-3 font-mono border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập nội dung đề bài tại đây (sử dụng Markdown và LaTeX cho công thức toán)."
              required
            ></textarea>
          </div>

          {/* Phần Lời giải (chỉ hiện cho Tự luận) */}
          {type === 'Tự luận' && (
            <div>
              <label htmlFor="solution" className="block text-gray-700 text-sm font-medium mb-2">Lời giải chi tiết (hỗ trợ Markdown & LaTeX):</label>
              <textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows="10"
                className="w-full p-3 font-mono border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Nhập lời giải chi tiết tại đây (không bắt buộc, sử dụng Markdown và LaTeX)."
              ></textarea>
            </div>
          )}
          
          {/* Phần Câu hỏi Trắc nghiệm (chỉ hiện cho Trắc nghiệm) */}
          {type === 'Trắc nghiệm' && (
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Các câu hỏi trắc nghiệm:</h3>
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">Nội dung câu hỏi {qIndex + 1}:</label>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Nhập nội dung câu hỏi trắc nghiệm (hỗ trợ Markdown & LaTeX)"
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
                      required
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
                    placeholder="Giải thích chi tiết đáp án"
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
                Thêm Câu hỏi Trắc nghiệm
              </button>
            </div>
          )}

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

          {/* Độ khó */}
          <div>
            <label htmlFor="difficulty" className="block text-gray-700 text-sm font-medium mb-2">Độ khó:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-gray-700 text-sm font-medium mb-2">Tags (phân cách bởi dấu phẩy):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ví dụ: Định luật Ohm, Mạch điện, Dòng điện xoay chiều"
            />
            <p className="mt-1 text-xs text-gray-500">Các thẻ giúp tìm kiếm và phân loại bài tập dễ dàng hơn.</p>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật bài tập...' : 'Cập nhật Bài tập'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditExercisePage;
