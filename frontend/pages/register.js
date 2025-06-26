// physics-olympiad-website/frontend/pages/register.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState(''); // Tên người dùng
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập và không phải đang tải auth, chuyển hướng về trang chủ
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true); // Bắt đầu trạng thái tải
    setError(null); // Xóa thông báo lỗi trước đó

    // Kiểm tra client-side: Đảm bảo tất cả các trường bắt buộc không rỗng
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Vui lòng nhập đầy đủ Tên người dùng, Email, Mật khẩu và Xác nhận mật khẩu.');
      setLoading(false);
      return;
    }

    // Kiểm tra client-side: Xác nhận mật khẩu
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại mật khẩu đã nhập.');
      setLoading(false);
      return;
    }

    // Kiểm tra client-side: Độ dài mật khẩu (có thể thêm)
    if (password.length < 6) { // Ví dụ: Mật khẩu tối thiểu 6 ký tự
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Gửi các trường tên, email, mật khẩu
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Đăng ký thành công, tự động đăng nhập
        login(data.user, data.token);
        router.push('/'); // Chuyển hướng về trang chủ
      } else {
        // Xử lý lỗi từ backend: Hiển thị thông báo lỗi cụ thể từ server (ví dụ: email đã tồn tại)
        setError(data.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      // Hiển thị lỗi kết nối mạng hoặc lỗi không xác định
      setError('Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  // Hiển thị trạng thái tải khi đang kiểm tra auth ban đầu
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Đang kiểm tra trạng thái đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <Head>
        <title>Đăng ký - Olympic Vật lý</title>
      </Head>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Đăng ký</h1>

        {/* Hiển thị thông báo lỗi */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
              Tên người dùng:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Chọn một tên người dùng duy nhất"
              required // Thêm required HTML attribute
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập địa chỉ email của bạn"
              required // Thêm required HTML attribute
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              required // Thêm required HTML attribute
              minLength="6" // Thêm minLength HTML attribute
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Xác nhận mật khẩu của bạn"
              required // Thêm required HTML attribute
            />
          </div>
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          Đã có tài khoản?{' '}
          <Link href="/login">
            <a className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
              Đăng nhập ngay
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
