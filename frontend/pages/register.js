// frontend/pages/register.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Đã sửa lỗi cú pháp ở đây
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { login } = useAuth(); // Consider removing auto-login after register if email confirmation is needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Client-side validation - MUST MATCH BACKEND
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      setLoading(false);
      return;
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      setLoading(false);
      return;
    }
    // IMPORTANT CHANGE: New password validation
    if (trimmedPassword.length < 8) { // Requires >= 8 characters
      setError('Mật khẩu phải dài ít nhất 8 ký tự.');
      setLoading(false);
      return;
    }
    if (trimmedPassword.includes(' ')) { // No spaces
      setError('Mật khẩu không được chứa dấu cách.');
      setLoading(false);
      return;
    }
    // At least one letter OR one number
    if (!(/[a-zA-Z]/.test(trimmedPassword) || /[0-9]/.test(trimmedPassword))) {
        setError('Mật khẩu phải chứa ít nhất một chữ cái hoặc một số.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi đăng ký.');
      }

      // Registration successful, redirect to login page with a success message
      router.push('/login?message=Đăng ký thành công! Vui lòng đăng nhập.');

    } catch (err) {
      console.error('Error during registration:', err);
      let errorMessage = 'Đã xảy ra lỗi không xác định trong quá trình đăng ký.';
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
        <title>Đăng ký - Olympic Vật lý</title>
      </Head>
      {/* Container chính với hiệu ứng gradient và căn giữa */}
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
        {/* Card chứa form */}
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-3xl border border-gray-200 backdrop-blur-sm bg-opacity-90 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-4xl">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Tạo tài khoản mới
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hãy tham gia cộng đồng của chúng tôi!
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="sr-only">Tên người dùng</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                placeholder="Tên người dùng (ít nhất 3 ký tự)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Địa chỉ Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                placeholder="Địa chỉ Email (ví dụ: user@example.com)"
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                placeholder="Mật khẩu (ít nhất 8 ký tự, gồm chữ, số, không khoảng trắng)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Xác nhận mật khẩu</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 ease-in-out focus:shadow-outline"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </div>
            <div className="text-center text-sm text-gray-600 mt-4">
              Đã có tài khoản?{' '}
              <Link href="/login">
                <a className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                  Đăng nhập tại đây
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
