// frontend/pages/login.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
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

  // Handle success message from registration
  useEffect(() => {
    if (router.query.message) {
      // display a temporary success message
      // For now, we'll just log it to console or you can set a state for a temporary banner
      console.log(router.query.message);
      // Remove the message from URL after display
      const { pathname, query } = router;
      const params = new URLSearchParams(query);
      params.delete('message');
      router.replace({ pathname, query: params.toString() }, undefined, { shallow: true });
    }
  }, [router.query.message, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      console.error('Login form submit error:', err);
      let errorMessage = 'Đã xảy ra lỗi không xác định trong quá trình đăng nhập.';
      if (err.message && err.message.startsWith('{')) { 
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
        <title>Đăng nhập - Olympic Vật lý</title>
      </Head>
      {/* Container chính với hiệu ứng gradient và căn giữa */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
        {/* Card chứa form */}
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-3xl border border-gray-200 backdrop-blur-sm bg-opacity-90 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-4xl">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Đăng nhập tài khoản
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Chào mừng trở lại! Hãy điền thông tin của bạn.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {router.query.message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{router.query.message}</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="identifier" className="sr-only">Email hoặc Tên đăng nhập</label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                  placeholder="Email hoặc Tên đăng nhập"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {/* Có thể thêm link quên mật khẩu sau này */}
                {/* <Link href="/forgot-password">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    Quên mật khẩu?
                  </a>
                </Link> */}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
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
                <a className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
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
