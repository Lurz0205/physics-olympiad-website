// physics-olympiad-website/frontend/components/AdminLayout.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Import useAuth để lấy thông tin người dùng và hàm logout

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth(); // Lấy user và logout từ AuthContext

  // Kiểm tra quyền admin
  if (!user || user.role !== 'admin') {
    // Nếu không phải admin, chuyển hướng về trang chủ hoặc trang đăng nhập
    if (typeof window !== 'undefined') { // Đảm bảo chỉ chạy ở client-side
      router.push('/login'); // Hoặc '/' tùy vào bạn muốn
    }
    return null; // Không render gì cả nếu không phải admin
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { name: 'Quản lý Lý thuyết', href: '/admin/theories', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    // THAY ĐỔI MỚI: Thêm mục "Quản lý Bài tập"
    { name: 'Quản lý Bài tập', href: '/admin/exercises', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    // Bạn có thể thêm các mục khác như "Quản lý Đề thi", "Quản lý Người dùng" ở đây
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-30 w-64 px-8 py-4 bg-gray-900 overflow-y-auto 
        transition duration-300 ease-out transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center mt-8">
          <Link href="/admin">
            <a className="text-white text-2xl font-semibold">Admin Panel</a>
          </Link>
        </div>

        <nav className="mt-10">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className={`flex items-center mt-4 py-2 px-6 rounded-lg 
                ${router.pathname.startsWith(item.href) ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                {item.icon}
                <span className="mx-3">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} 
                    className="text-gray-500 focus:outline-none lg:hidden">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6H20M4 12H20M4 18H20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-medium text-gray-800 ml-4 hidden md:block">
              {navItems.find(item => router.pathname.startsWith(item.href))?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center">
            <span className="text-gray-800 mr-4">Xin chào, {user?.name || 'Admin'}!</span>
            <button onClick={logout} 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none">
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
