// frontend/pages/_app.js
import '../styles/globals.css';
import 'katex/dist/katex.min.css'; // Đảm bảo KaTeX CSS vẫn được import
import { AuthProvider, useAuth } from '../context/AuthContext'; // THAY ĐỔI: Thêm useAuth
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';
import LoadingOverlay from '../components/LoadingOverlay'; // THAY ĐỔI MỚI: Import LoadingOverlay

function MyApp({ Component, pageProps }) {
  // MyApp sẽ chỉ bọc AuthProvider
  return (
    <AuthProvider>
      {/* Mọi logic sử dụng useAuth sẽ nằm trong AppContent */}
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

// THAY ĐỔI MỚI: Tạo AppContent để chứa logic hiển thị dựa trên AuthContext
function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { authLoading } = useAuth(); // Lấy authLoading từ AuthContext

  // Danh sách các đường dẫn cần ẩn Navbar chính
  const noNavPaths = ['/login', '/register']; 
  
  const isAdminPath = router.pathname.startsWith('/admin');

  // Điều kiện hiển thị Navbar chính
  const showNav = !noNavPaths.some(path => router.pathname === path) && !isAdminPath;

  // HIỂN THỊ LOADING OVERLAY NẾU ĐANG TẢI THÔNG TIN XÁC THỰC
  if (authLoading) {
    return <LoadingOverlay />;
  }

  // Nếu không loading, hiển thị nội dung ứng dụng
  return (
    <>
      {showNav && <Navbar />}
      {isAdminPath ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
