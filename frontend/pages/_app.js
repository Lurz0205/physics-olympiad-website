// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Giả sử bạn có component Layout

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* THAY ĐỔI: Loại bỏ hoặc thay thế bg-red-200 */}
      {/* Ví dụ: chỉ giữ min-h-screen để div này vẫn chiếm hết chiều cao */}
      {/* Hoặc thay thế bằng bg-white nếu bạn muốn div này có nền trắng rõ ràng */}
      <div className="min-h-screen"> {/* Đã xóa bg-red-200 */}
        {/* Đảm bảo Layout component của bạn cũng không có màu nền ghi đè */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
