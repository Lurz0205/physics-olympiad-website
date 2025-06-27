// physics-olympiad-website/frontend/pages/admin/index.js
import React, { useEffect } from 'react'; // THAY ĐỔI: Thêm useEffect
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'; // THAY ĐỔI: Thêm useRouter
import { useAuth } from '../../context/AuthContext'; // THAY ĐỔI: Thêm useAuth

const AdminDashboard = () => {
  const { user, authLoading } = useAuth(); // THAY ĐỔI: Lấy user và authLoading từ AuthContext
  const router = useRouter(); // THAY ĐỔI: Khởi tạo router

  useEffect(() => {
    // Nếu vẫn đang tải thông tin xác thực, không làm gì cả
    if (authLoading) {
      return;
    }

    // Nếu không có người dùng hoặc vai trò không phải là 'admin'
    if (!user || user.role !== 'admin') {
      console.log('Access Denied: Not an admin. Redirecting...');
      router.push('/'); // THAY ĐỔI: Chuyển hướng về trang chủ
      // Hoặc router.push('/login'); nếu bạn muốn họ đăng nhập lại
    }
  }, [user, authLoading, router]); // Dependency array: chạy lại khi user, authLoading, hoặc router thay đổi

  // Hiển thị một cái gì đó trong khi đang kiểm tra quyền
  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-lg text-gray-700">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Nếu người dùng là admin, hiển thị dashboard
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
          <DashboardCard title="Quản lý Lý thuyết" description="Thêm, sửa, xóa các bài lý thuyết." link="/admin/theory" /> {/* CHÚ Ý: Link đã chỉnh thành /admin/theory */}
          <DashboardCard title="Quản lý Bài tập" description="Thêm, sửa, xóa các chủ đề và câu hỏi bài tập." link="/admin/exercise" /> {/* CHÚ Ý: Link đã chỉnh thành /admin/exercise */}
          <DashboardCard title="Quản lý Đề thi" description="Thêm, sửa, xóa các đề thi và câu hỏi." link="/admin/tests" />
          <DashboardCard title="Quản lý Người dùng" description="Xem, sửa vai trò hoặc xóa người dùng." link="/admin/users" />
        </div>
      </div>
    </>
  );
};

// Helper component cho các card trên Dashboard
const DashboardCard = ({ title, description, link }) => (
  <Link href={link}> {/* Đã bỏ className="h-full" ở đây để Link không gây lỗi, sẽ áp dụng trên thẻ <a> */}
    <a className="block bg-blue-500 text-white rounded-lg shadow-lg p-6 hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </a>
  </Link>
);

export default AdminDashboard;
