import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-primary p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold rounded-lg hover:opacity-90 transition duration-300">
          Vật lý HSG
        </Link>
        <div className="space-x-4">
          <Link href="/theory" className="text-white hover:text-gray-200 transition duration-300 p-2 rounded-md hover:bg-primary-dark">
            Lý thuyết
          </Link>
          <Link href="/practice" className="text-white hover:text-gray-200 transition duration-300 p-2 rounded-md hover:bg-primary-dark">
            Bài tập
          </Link>
          <Link href="/tests" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md">
            Đề thi Online
          </Link>
          {user ? (
            <>
              <span className="text-white">Xin chào, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-accent text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 shadow-md"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md">
                Đăng nhập
              </Link>
              <Link href="/register" className="bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
