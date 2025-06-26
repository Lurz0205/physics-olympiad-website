// physics-olympiad-website/frontend/pages/login.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // Thay đổi 'email' thành 'identifier' để hỗ trợ cả email và tên người dùng
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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

    // Kiểm tra các trường nhập liệu không được rỗng
    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ email/tên người dùng và mật khẩu.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Gửi 'identifier' thay vì 'email'
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Đăng nhập thành công, gọi hàm login từ AuthContext
        login(data.user, data.token);
        router.push('/'); // Chuyển hướng về trang chủ
      } else {
        // Xử lý lỗi từ backend
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError('Đã xảy ra lỗi khi kết nối máy chủ.');
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  // Hiển thị trạng thái tải khi đang kiểm tra auth
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
        <title>Đăng nhập - Olympic Vật lý</title>
      </Head>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h1>

        {/* Hiển thị thông báo lỗi */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* Thay đổi label và input cho 'identifier' */}
            <label htmlFor="identifier" className="block text-gray-700 text-sm font-medium mb-2">
              Email hoặc Tên người dùng:
            </label>
            <input
              type="text" // Thay đổi type thành 'text' để chấp nhận cả tên người dùng
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập email hoặc tên người dùng của bạn"
              required
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
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          Chưa có tài khoản?{' '}
          <Link href="/register">
            <a className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
              Đăng ký ngay
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
