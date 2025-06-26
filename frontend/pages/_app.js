// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Layout cho người dùng thông thường
import AdminLayout from '../components/AdminLayout'; // THAY ĐỔI MỚI: Import AdminLayout

function MyApp({ Component, pageProps }) {
  // THAY ĐỔI MỚI: Kiểm tra nếu component hiện tại thuộc Admin Panel
  const isAdminPage = Component.displayName?.startsWith('Admin') || Component.name?.startsWith('Admin');
  // Hoặc bạn có thể dùng `router.pathname.startsWith('/admin')` nếu truy cập router ở đây
  // Nhưng để đơn giản, chúng ta sẽ dựa vào tên component bắt đầu bằng 'Admin'

  const SelectedLayout = isAdminPage ? AdminLayout : Layout;

  return (
    <AuthProvider>
      {/* Sử dụng SelectedLayout dựa trên việc đây có phải trang admin hay không */}
      <SelectedLayout>
        <Component {...pageProps} />
      </SelectedLayout>
    </AuthProvider>
  );
}

export default MyApp;
