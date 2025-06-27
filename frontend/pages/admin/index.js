// physics-olympiad-website/frontend/pages/admin/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
// Bỏ useEffect, useRouter, useAuth vì AdminLayout đã lo hết

const AdminDashboard = () => {
  // Logic kiểm tra quyền đã chuyển vào AdminLayout.js
  return (
    <>
      <Head>
        <title>Admin Dashboard - Olympic Vật lý</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Chào mừng đến với Admin Dashboard!</h2>
        <p className="text-gray-700 text-lg mb-6">
          Sử dụng thanh điều hướng bên trái để quản lý nội dung và người dùng của hệ thống.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* THAY ĐỔI LINK: Sử dụng đường dẫn số nhiều để khớp với cấu trúc thư mục */}
          <DashboardCard title="Quản lý Lý thuyết" description="Thêm, sửa, xóa các bài lý thuyết." link="/admin/theories" /> 
          <DashboardCard title="Quản lý Bài tập" description="Thêm, sửa, xóa các chủ đề và câu hỏi bài tập." link="/admin/practice" /> 
          <DashboardCard title="Quản lý Đề thi" description="Thêm, sửa, xóa các đề thi và câu hỏi." link="/admin/tests" />
          <DashboardCard title="Quản lý Người dùng" description="Xem, sửa vai trò hoặc xóa người dùng." link="/admin/users" />
        </div>
      </div>
    </>
  );
};

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
