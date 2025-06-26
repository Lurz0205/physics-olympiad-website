// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Giả sử bạn có component Layout

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Áp dụng class bg-pure-white để đảm bảo nền trắng */}
      <div className="min-h-screen bg-pure-white"> {/* Đã thêm class bg-pure-white */}
        {/* Đảm bảo Layout component của bạn cũng không có màu nền ghi đè */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
