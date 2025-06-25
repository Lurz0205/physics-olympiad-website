import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        router.push('/'); // Redirect to home after successful login
      } else {
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - Vật lý HSG</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md p-6 bg-white rounded-xl shadow-xl mt-8">
        <h2 className="text-4xl font-bold text-primary mb-8">Đăng nhập</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white font-bold py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
          >
            Đăng nhập
          </button>
        </form>
        <p className="mt-6 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
