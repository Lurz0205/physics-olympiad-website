// physics-olympiad-website/frontend/components/Navbar.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg p-2 sm:p-3 sticky top-0 z-50 rounded-b-xl min-h-[64px] flex items-center">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center w-full">
        <Link href="/">
          <a className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors duration-300 inline-flex items-center justify-center h-full min-w-[50px] sm:min-w-[60px]">
            HTB
          </a>
        </Link>

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

        <div className="hidden md:flex items-center space-x-4">
          <NavLink href="/theory">Lý thuyết</NavLink>
          <NavLink href="/exercise">Bài tập</NavLink>
          {/* THAY ĐỔI: Đảm bảo link Đề thi Online trỏ đến /tests */}
          <NavLink href="/tests">Đề thi Online</NavLink> 
          
          {user ? (
            <>
              <span className="text-sm sm:text-base font-medium whitespace-nowrap inline-flex items-center justify-center h-10 min-w-[100px]">
                Xin chào, {user.name ? user.name.split(' ')[0] : 'Bạn'}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105 whitespace-nowrap text-sm sm:text-base h-10 inline-flex items-center justify-center"
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

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 shadow-lg pb-4 rounded-b-xl z-40">
          <div className="flex flex-col items-center space-y-4 py-4">
            <NavLinkMobile href="/theory" onClick={toggleMenu}>Lý thuyết</NavLinkMobile>
            <NavLinkMobile href="/exercise" onClick={toggleMenu}>Bài tập</NavLinkMobile>
            {/* THAY ĐỔI: Đảm bảo link Đề thi Online trỏ đến /tests */}
            <NavLinkMobile href="/tests" onClick={toggleMenu}>Đề thi Online</NavLinkMobile>
            
            {user ? (
              <>
                <span className="text-white text-base font-medium px-4 py-2 inline-flex items-center justify-center h-12 min-w-[120px]">
                  Xin chào, {user.name ? user.name.split(' ')[0] : 'Bạn'}
                </span>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-md inline-flex items-center justify-center h-12"
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

const NavLink = ({ href, children }) => (
  <Link href={href}>
    <a className="text-sm sm:text-base font-medium px-2.5 py-1 sm:px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap inline-flex items-center justify-center h-10 min-w-[80px]">
      <span className="inline-block" style={{ minWidth: 'fit-content' }}>
        {children}
      </span>
    </a>
  </Link>
);

const NavLinkMobile = ({ href, children, onClick }) => (
  <Link href={href}>
    <a onClick={onClick} className="text-white text-base font-medium w-full text-center py-2 hover:bg-blue-600 transition-colors duration-300 rounded-md inline-flex items-center justify-center h-12 min-w-[120px]">
      <span className="inline-block" style={{ minWidth: 'fit-content' }}>
        {children}
      </span>
    </a>
  </Link>
);

export default Navbar;
