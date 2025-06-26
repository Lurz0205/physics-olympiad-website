// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import { useRouter } from 'next/router'; // THAY ĐỔI MỚI: Import useRouter

function MyApp({ Component, pageProps }) {
  const router = useRouter(); // THAY ĐỔI MỚI: Lấy đối tượng router

  // THAY ĐỔI MỚI: Kiểm tra nếu đường dẫn hiện tại bắt đầu bằng '/admin'
  const isAdminPage = router.pathname.startsWith('/admin');

  const SelectedLayout = isAdminPage ? AdminLayout : Layout;

  return (
    <AuthProvider>
      <SelectedLayout>
        <Component {...pageProps} />
      </SelectedLayout>
    </AuthProvider>
  );
}

export default MyApp;
