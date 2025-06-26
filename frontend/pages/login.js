// physics-olympiad-website/frontend/pages/login.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting login with:');
    console.log('Email:', email);
    // console.log('Password:', password); // KHÔNG log password trong môi trường production thực tế

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend login error response:', data);
        throw new Error(data.message || 'Lỗi đăng nhập.');
      }

      // Đăng nhập thành công, lưu thông tin người dùng và token vào AuthContext
      login(data.user, data.token);

      // THAY ĐỔI QUAN TRỌNG: CHUYỂN HƯỚNG DỰA TRÊN VAI TRÒ
      if (data.user && data.user.role === 'admin') {
        router.push('/admin'); // Chuyển hướng Admin đến Admin Panel
      } else {
        router.push('/'); // Chuyển hướng người dùng thông thường về trang chủ
      }

    } catch (err) {
      console.error('Error during login:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định trong quá trình đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-inter"> {/* Đã chỉnh background và font */}
      <Head>
        <title>Đăng nhập - Olympic Vật lý</title>
      </Head>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200"> {/* Đã chỉnh rounded, shadow, border */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert"> {/* Đã chỉnh rounded */}
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Địa chỉ Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" // Đã chỉnh rounded, thêm mb
                placeholder="Địa chỉ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" // Đã chỉnh rounded
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-md hover:shadow-lg" // Đã chỉnh rounded, shadow
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{' '}
          <Link href="/register">
            <a className="font-medium text-blue-600 hover:text-blue-500">
              Đăng ký ngay
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
