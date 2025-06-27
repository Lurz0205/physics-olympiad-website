// frontend/pages/register.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { login } = useAuth(); // Bạn có thể cân nhắc không tự động login sau register nếu có bước xác nhận email

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim(); // Trim password client-side
    const trimmedConfirmPassword = confirmPassword.trim();

    // Client-side validation - PHẢI KHỚP VỚI BACKEND
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
    // THAY ĐỔI QUAN TRỌNG: Validation mật khẩu mới
    if (trimmedPassword.length < 8) { // Yêu cầu >= 8 ký tự
      setError('Mật khẩu phải dài ít nhất 8 ký tự.');
      setLoading(false);
      return;
    }
    if (trimmedPassword.includes(' ')) { // Không chứa dấu cách
      setError('Mật khẩu không được chứa dấu cách.');
      setLoading(false);
      return;
    }
    // Ít nhất một chữ cái HOẶC một số
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
        // Cố gắng lấy thông báo lỗi từ backend nếu có
        throw new Error(data.message || 'Lỗi đăng ký.');
      }

      // Đăng ký thành công, tự động đăng nhập nếu backend trả về user/token
      if (data.token) { 
        router.push('/login?message=Đăng ký thành công! Vui lòng đăng nhập.');

      } else {
        router.push('/login?message=Đăng ký thành công! Vui lòng đăng nhập.');
      }

    } catch (err) {
      console.error('Error during registration:', err);
      // Cố gắng parse lỗi từ Backend nếu có
      let errorMessage = 'Đã xảy ra lỗi không xác định trong quá trình đăng ký.';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <Head>
        <title>Đăng ký - Olympic Vật lý</title>
      </Head>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}> {/* BẮT ĐẦU FORM */}
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mb-4"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mb-4"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mb-4"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </form> {/* KẾT THÚC FORM */}

        {/* Phần này nằm ngoài form */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{' '}
          <Link href="/login">
            <a className="font-medium text-blue-600 hover:text-blue-500">
              Đăng nhập tại đây
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
