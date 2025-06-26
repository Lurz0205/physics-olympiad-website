// physics-olympiad-website/frontend/pages/admin/practice/edit/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';

const EditExercisePage = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy ID bài tập từ URL
  const { token, user } = useAuth(); // Lấy token và user để xác thực

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState('CƠ HỌC');
  const [difficulty, setDifficulty] = useState('Trung bình');
  const [tags, setTags] = useState('');

  const [loading, setLoading] = useState(true); // Loading khi tải dữ liệu bài tập
  const [submitting, setSubmitting] = useState(false); // Loading khi submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['CƠ HỌC', 'NHIỆT HỌC', 'ĐIỆN HỌC', 'QUANG HỌC', 'VẬT LÝ HẠT NHÂN', 'THUYẾT TƯƠNG ĐỐI', 'VẬT LÝ HIỆN ĐẠI', 'Chưa phân loại'];
  const difficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  // Chuyển hướng nếu không phải admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/admin'); // Hoặc trang lỗi
    }
  }, [user, router]);

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
    // Chỉ tự động cập nhật slug nếu người dùng chưa can thiệp vào trường slug
    // Một cách đơn giản là chỉ cập nhật nếu slug rỗng hoặc giống với slug ban đầu từ tiêu đề
    if (!slug || generateSlug(newTitle) === slug) { // Check this carefully if user can manually edit slug
      setSlug(generateSlug(newTitle));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    // Client-side validation cơ bản
    if (!title.trim() || !slug.trim() || !problemStatement.trim() || !category.trim() || !difficulty.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đề bài, Danh mục, Độ khó).');
      setSubmitting(false);
      return;
    }

    try {
      const exerciseData = {
        title,
        slug,
        description: description.trim(),
        problemStatement,
        solution: solution.trim(),
        category,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
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
      // Tùy chọn: chuyển hướng về danh sách bài tập sau một thời gian
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
          <p className="text-xl text-gray-700">Đang tải dữ liệu bài tập...</p>
        </div>
      </div>
    );
  }

  if (error && !submitting) { // Chỉ hiển thị lỗi tải dữ liệu, không phải lỗi submit
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

        {/* Thông báo lỗi/thành công từ quá trình submit */}
        {error && submitting && ( // Chỉ hiển thị lỗi nếu đang trong quá trình submit
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

          {/* Slug (tự động tạo, chỉ đọc) */}
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

          {/* Lời giải */}
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
