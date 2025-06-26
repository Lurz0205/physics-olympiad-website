// physics-olympiad-website/frontend/components/Navbar.js
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg p-4 sticky top-0 z-50 rounded-b-xl"> {/* Màu xanh đậm, gradient, bo tròn đáy, shadow */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Tên ứng dụng */}
        <Link href="/">
          <a className="text-3xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors duration-300">
            Vật lý HSG
          </a>
        </Link>

        {/* Các liên kết điều hướng */}
        <div className="flex items-center space-x-6">
          <NavLink href="/theory">Lý thuyết</NavLink>
          <NavLink href="/practice">Bài tập</NavLink>
          <NavLink href="/tests">Đề thi Online</NavLink>
          
          {user ? (
            <>
              <span className="text-white text-lg font-medium">Xin chào, {user.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105"
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
    <a className="text-white text-lg font-medium px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300">
      {children}
    </a>
  </Link>
);

export default Navbar;
