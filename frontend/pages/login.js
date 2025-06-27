// frontend/pages/login.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // THAY ĐỔI: Đổi từ 'email' thành 'identifier'
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password); // THAY ĐỔI: Truyền 'identifier' thay vì 'email'
    } catch (err) {
      console.error('Login form submit error:', err);
      // Cố gắng parse lỗi từ Backend nếu có
      let errorMessage = 'Đã xảy ra lỗi không xác định trong quá trình đăng nhập.';
      if (err.message && err.message.startsWith('{')) { // Nếu lỗi là JSON string
        try {
          const errorObj = JSON.parse(err.message);
          errorMessage = errorObj.message || errorMessage;
        } catch (parseError) {
          // Fallback if not a valid JSON string
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - HTB</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Đăng nhập vào tài khoản của bạn
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="identifier" className="sr-only">Email hoặc Tên đăng nhập</label>
                <input
                  id="identifier" // THAY ĐỔI: Đổi id thành 'identifier'
                  name="identifier" // THAY ĐỔI: Đổi name thành 'identifier'
                  type="text"
                  autoComplete="username" // auto-complete cho cả email/username
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email hoặc Tên đăng nhập"
                  value={identifier} // THAY ĐỔI: Dùng state 'identifier'
                  onChange={(e) => setIdentifier(e.target.value)} // THAY ĐỔI: Cập nhật state 'identifier'
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
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
            <div className="text-center text-sm">
              <Link href="/register">
                <a className="font-medium text-indigo-600 hover:text-indigo-500">
                  Chưa có tài khoản? Đăng ký ngay
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
