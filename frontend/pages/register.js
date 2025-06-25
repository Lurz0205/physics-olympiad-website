import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setUsername('');
        setPassword('');
        // Optional: Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Head>
        <title>Đăng ký - Vật lý HSG</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md p-6 bg-white rounded-xl shadow-xl mt-8">
        <h2 className="text-4xl font-bold text-primary mb-8">Đăng ký tài khoản</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
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
            Đăng ký
          </button>
        </form>
        <p className="mt-6 text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
