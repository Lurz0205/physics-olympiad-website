// physics-olympiad-website/frontend/components/Navbar.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State để điều khiển menu mobile

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    // Đảm bảo chiều cao cố định cho Navbar để ngăn chặn dịch chuyển dọc của toàn bộ thanh
    // min-h-[64px] (tương đương h-16) cho một chiều cao chuẩn.
    // flex items-center để căn giữa nội dung bên trong theo chiều dọc.
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg p-2 sm:p-3 sticky top-0 z-50 rounded-b-xl min-h-[64px] flex items-center">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center w-full">
        {/* Logo/Tên ứng dụng */}
        <Link href="/">
          {/* THAY ĐỔI: Đảm bảo chiều cao cố định cho logo và căn chỉnh văn bản */}
          {/* min-w-[50px] sm:min-w-[60px]: Giữ không gian cho chữ HTB để tránh giật ngang */}
          {/* h-full: Đảm bảo chiều cao bằng parent (Navbar), flex/items-center/justify-center: căn giữa text */}
          <a className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors duration-300 inline-flex items-center justify-center h-full min-w-[50px] sm:min-w-[60px]">
            HTB
          </a>
        </Link>

        {/* Hamburger menu icon cho mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none p-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Các liên kết điều hướng cho Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink href="/theory">Lý thuyết</NavLink>
          <NavLink href="/practice">Bài tập</NavLink>
          <NavLink href="/tests">Đề thi Online</NavLink>
          
          {user ? (
            <>
              {/* THAY ĐỔI: Đảm bảo span 'Xin chào' có chiều cao và min-width cố định */}
              <span className="text-sm sm:text-base font-medium whitespace-nowrap inline-flex items-center justify-center h-10 min-w-[100px]"> {/* h-10 tương đương py-1.5 */}
                Xin chào, {user.name ? user.name.split(' ')[0] : 'Bạn'}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105 whitespace-nowrap text-sm sm:text-base h-10 inline-flex items-center justify-center" // Thêm h-10, inline-flex
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

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 shadow-lg pb-4 rounded-b-xl z-40">
          <div className="flex flex-col items-center space-y-4 py-4">
            <NavLinkMobile href="/theory" onClick={toggleMenu}>Lý thuyết</NavLinkMobile>
            <NavLinkMobile href="/practice" onClick={toggleMenu}>Bài tập</NavLinkMobile>
            <NavLinkMobile href="/tests" onClick={toggleMenu}>Đề thi Online</NavLinkMobile>
            
            {user ? (
              <>
                {/* THAY ĐỔI: Đảm bảo span 'Xin chào' trong mobile menu cũng có chiều cao và min-width cố định */}
                <span className="text-white text-base font-medium px-4 py-2 inline-flex items-center justify-center h-12 min-w-[120px]"> {/* h-12 tương đương py-2 */}
                  Xin chào, {user.name ? user.name.split(' ')[0] : 'Bạn'}
                </span>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-md inline-flex items-center justify-center h-12" // Thêm h-12, inline-flex
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLinkMobile href="/login" onClick={toggleMenu}>Đăng nhập</NavLinkMobile>
                <NavLinkMobile href="/register" onClick={toggleMenu}>Đăng ký</NavLinkMobile>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component cho các liên kết điều hướng Desktop
const NavLink = ({ href, children }) => (
  <Link href={href}>
    {/* THAY ĐỔI: Đặt min-width cụ thể và chiều cao cố định cho các liên kết điều hướng */}
    {/* Sử dụng h-10 để khớp với chiều cao nút Đăng xuất */}
    <a className="text-sm sm:text-base font-medium px-2.5 py-1 sm:px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap inline-flex items-center justify-center h-10 min-w-[80px]">
      {children}
    </a>
  </Link>
);

// Helper component cho các liên kết điều hướng Mobile
const NavLinkMobile = ({ href, children, onClick }) => (
  <Link href={href}>
    {/* THAY ĐỔI: Đặt chiều cao cố định và min-width cho các liên kết điều hướng mobile */}
    {/* Sử dụng h-12 để khớp với chiều cao nút Đăng xuất mobile */}
    <a onClick={onClick} className="text-white text-base font-medium w-full text-center py-2 hover:bg-blue-600 transition-colors duration-300 rounded-md inline-flex items-center justify-center h-12 min-w-[120px]">
      {children}
    </a>
  </Link>
);

export default Navbar;
