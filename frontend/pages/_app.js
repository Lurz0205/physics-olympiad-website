// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import LoadingOverlay from '../components/LoadingOverlay'; // THAY ĐỔI MỚI: Import LoadingOverlay
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'; // THAY ĐỔI MỚI: Import useState, useEffect

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const SelectedLayout = isAdminPage ? AdminLayout : Layout;

  // THAY ĐỔI MỚI: State để điều khiển Loading Overlay
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ẩn loading overlay sau 500ms (hoặc 700ms, 1000ms tùy bạn thấy mượt)
    // Thời gian này đủ để font và các CSS cơ bản được tải và render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Bạn có thể điều chỉnh thời gian này

    // Cleanup timer khi component unmount
    return () => clearTimeout(timer);
  }, []); // Chạy một lần khi ứng dụng được mount

  return (
    <AuthProvider>
      {/* THAY ĐỔI MỚI: Hiển thị LoadingOverlay nếu isLoading là true */}
      {isLoading && <LoadingOverlay />}

      {/* Phần tử bọc ngoài cùng với các Tailwind classes cơ bản */}
      <div className="bg-white min-h-screen flex flex-col font-inter text-gray-700 leading-relaxed">
        <SelectedLayout>
          <Component {...pageProps} />
        </SelectedLayout>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
