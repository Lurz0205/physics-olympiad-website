// physics-olympiad-website/frontend/components/Layout.js
import React from 'react';
import Navbar from './Navbar'; // Import Navbar component

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> {/* Nền xám nhạt tinh tế cho toàn bộ nội dung */}
      <Navbar /> {/* Thanh điều hướng */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8"> {/* Container cho nội dung chính */}
        {children}
      </main>
      {/* Bạn có thể thêm Footer ở đây nếu có */}
      {/* <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        Bản quyền © 2024 Olympic Vật lý HSG
      </footer> */}
    </div>
  );
};

export default Layout;
