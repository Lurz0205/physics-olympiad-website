// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Giả sử bạn có component Layout

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Thay đổi màu nền của div bọc toàn bộ ứng dụng */}
      {/* Ví dụ: bg-white hoặc bg-gray-50 */}
      <div className="bg-white min-h-screen"> {/* Đã sửa bg-red-200 thành bg-white */}
        <Layout> {/* Nếu bạn có Layout component */}
          <Component {...pageProps} />
        </Layout>
        {/* Hoặc nếu không có Layout: */}
        {/* <Component {...pageProps} /> */}
      </div>
    </AuthProvider>
  );
}

export default MyApp;
