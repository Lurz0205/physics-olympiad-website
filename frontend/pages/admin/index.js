// physics-olympiad-website/frontend/pages/admin/index.js
import React from 'react'; // Bỏ useEffect, useRouter, useAuth
import Head from 'next/head';
import Link from 'next/link';
// Bỏ import AdminNavbar

const AdminDashboard = () => {
  // Logic kiểm tra quyền đã chuyển vào AdminLayout.js
  // Nếu bạn muốn hiển thị loading state hoặc thông báo lỗi ở đây,
  // bạn có thể thêm lại, nhưng AdminLayout đã lo phần redirect.

  return (
    <>
      <Head>
        <title>Admin Dashboard - Olympic Vật lý</title>
      </Head>
      {/* KHÔNG CÒN AdminNavbar ở đây nữa, AdminLayout sẽ bọc toàn bộ */}
      <div className="bg-white rounded-lg shadow-md p-6"> {/* Bọc nội dung chính của dashboard */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Chào mừng đến với Admin Dashboard!</h2>
        <p className="text-gray-700 text-lg mb-6">
          Sử dụng thanh điều hướng bên trái để quản lý nội dung và người dùng của hệ thống.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Đảm bảo các link này khớp với href trong AdminLayout.js */}
          <DashboardCard title="Quản lý Lý thuyết" description="Thêm, sửa, xóa các bài lý thuyết." link="/admin/theory" /> 
          <DashboardCard title="Quản lý Bài tập" description="Thêm, sửa, xóa các chủ đề và câu hỏi bài tập." link="/admin/exercise" /> 
          <DashboardCard title="Quản lý Đề thi" description="Thêm, sửa, xóa các đề thi và câu hỏi." link="/admin/tests" />
          <DashboardCard title="Quản lý Người dùng" description="Xem, sửa vai trò hoặc xóa người dùng." link="/admin/users" />
        </div>
      </div>
    </>
  );
};

// Helper component cho các card trên Dashboard
const DashboardCard = ({ title, description, link }) => (
  <Link href={link}>
    <a className="block bg-blue-500 text-white rounded-lg shadow-lg p-6 hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </a>
  </Link>
);

export default AdminDashboard;
