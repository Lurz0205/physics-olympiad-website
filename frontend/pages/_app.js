// frontend/pages/_app.js
import '../styles/globals.css';
import 'katex/dist/katex.min.css'; // Đảm bảo KaTeX CSS vẫn được import
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout'; // THAY ĐỔI MỚI: Import AdminLayout

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Danh sách các đường dẫn cần ẩn Navbar chính
  // (Giờ đây AdminLayout sẽ tự cung cấp thanh điều hướng riêng)
  const noNavPaths = ['/login', '/register']; // Chỉ ẩn Navbar trên login/register
  
  // THAY ĐỔI MỚI: Xác định xem có phải là một trang admin hay không
  const isAdminPath = router.pathname.startsWith('/admin');

  // Điều kiện hiển thị Navbar chính
  const showNav = !noNavPaths.some(path => router.pathname === path) && !isAdminPath;

  return (
    <AuthProvider>
      {showNav && <Navbar />}
      {/* THAY ĐỔI MỚI: Áp dụng AdminLayout nếu là trang admin */}
      {isAdminPath ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        // Nếu không phải trang admin, chỉ render Component bình thường
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
