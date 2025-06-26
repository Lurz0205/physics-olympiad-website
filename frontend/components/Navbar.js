// physics-olympiad-website/frontend/components/Navbar.js
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg p-2 sm:p-3 sticky top-0 z-50 rounded-b-xl"> {/* Giảm padding: p-2 trên mobile, sm:p-3 trên desktop */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        {/* Logo/Tên ứng dụng */}
        <Link href="/">
          <a className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors duration-300"> {/* Giảm font size: text-xl trên mobile, sm:text-2xl trên desktop */}
            Vật lý HSG
          </a>
        </Link>

        {/* Các liên kết điều hướng */}
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0 flex-wrap justify-end"> {/* Giảm space-x: space-x-2 trên mobile, sm:space-x-4 trên desktop */}
          <NavLink href="/theory">Lý thuyết</NavLink>
          <NavLink href="/practice">Bài tập</NavLink>
          <NavLink href="/tests">Đề thi Online</NavLink>
          
          {user ? (
            <>
              <span className="text-sm sm:text-base font-medium whitespace-nowrap"> {/* Giảm font size: text-sm trên mobile, sm:text-base trên desktop */}
                Xin chào, {user.name ? user.name.split(' ')[0] : 'Bạn'}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105 whitespace-nowrap text-sm sm:text-base" /* Giảm padding và font size */
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">Đăng nhập</NavLink>
              <NavLink href="/register">Đăng ký</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Helper component cho các liên kết điều hướng
const NavLink = ({ href, children }) => (
  <Link href={href}>
    <a className="text-sm sm:text-base font-medium px-2.5 py-1 sm:px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap"> {/* Giảm padding và font size */}
      {children}
    </a>
  </Link>
);

export default Navbar;
