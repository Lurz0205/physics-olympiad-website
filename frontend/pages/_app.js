// physics-olympiad-website/frontend/pages/_app.js
import '../styles/globals.css'; // Global CSS (quan trọng!)
import { AuthProvider } from '../context/AuthContext'; // Auth Context
import Layout from '../components/Layout'; // Layout Component

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Layout component sẽ bọc toàn bộ các trang */}
      {/* Màu nền của ứng dụng sẽ được quản lý bởi Layout.js */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
