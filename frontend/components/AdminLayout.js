// physics-olympiad-website/frontend/components/AdminLayout.js
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect nếu không phải admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login'); // Chuyển hướng về trang đăng nhập nếu không phải admin
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    // Hiển thị trạng thái tải hoặc thông báo chờ chuyển hướng
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="text-2xl font-bold mb-8 text-center text-blue-300">Admin Panel</div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <AdminNavLink href="/admin">Dashboard</AdminNavLink>
            <li className="pt-4 text-gray-400 text-xs font-semibold uppercase">Quản lý nội dung</li>
            <AdminNavLink href="/admin/theories">Lý thuyết</AdminNavLink>
            <AdminNavLink href="/admin/practice">Bài tập</AdminNavLink>
            <AdminNavLink href="/admin/tests">Đề thi</AdminNavLink>
            <li className="pt-4 text-gray-400 text-xs font-semibold uppercase">Quản lý người dùng</li>
            <AdminNavLink href="/admin/users">Người dùng</AdminNavLink>
          </ul>
        </nav>
        <div className="mt-auto text-center text-gray-400 text-sm">
          &copy; 2024 Olympic Vật lý HSG
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header (Tùy chọn, có thể đơn giản) */}
        <header className="bg-white shadow p-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-semibold text-gray-800">
            {router.pathname === '/admin' ? 'Dashboard' :
             router.pathname.includes('/admin/theories') ? 'Quản lý Lý thuyết' :
             router.pathname.includes('/admin/practice') ? 'Quản lý Bài tập' :
             router.pathname.includes('/admin/tests') ? 'Quản lý Đề thi' :
             router.pathname.includes('/admin/users') ? 'Quản lý Người dùng' :
             'Admin Panel'}
          </h1>
          <button
            onClick={() => router.push('/')} // Quay lại trang chính của user
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Về Trang chính
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper component cho các liên kết trong Admin Sidebar
const AdminNavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href || (href !== '/admin' && router.pathname.startsWith(href));
  return (
    <li>
      <Link href={href}>
        <a className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}>
          {children}
        </a>
      </Link>
    </li>
  );
};

export default AdminLayout;
