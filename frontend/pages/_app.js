// frontend/pages/_app.js
import '../styles/globals.css';
import 'katex/dist/katex.min.css'; // Đảm bảo KaTeX CSS vẫn được import
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar'; // Đảm bảo Navbar đã được import
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Danh sách các đường dẫn không hiển thị Navbar
  // (Nếu bạn muốn Navbar hiển thị trên các trang admin, thì cần điều chỉnh logic này)
  const noNavPaths = ['/login', '/register', '/admin', '/admin/users', '/admin/theory', '/admin/exercise', '/admin/tests', '/admin/theory/new', '/admin/exercise/new', '/admin/tests/new', '/admin/theory/edit/[slug]', '/admin/exercise/edit/[slug]', '/admin/tests/edit/[slug]'];
  const showNav = !noNavPaths.some(path => {
    // Để xử lý các đường dẫn động như /admin/theory/edit/[slug]
    if (path.includes('[slug]')) {
      const basepath = path.replace('/[slug]', '');
      return router.pathname.startsWith(basepath.replace('/edit', '')); // Kiểm tra base path của admin routes
    }
    return router.pathname === path;
  });

  return (
    <AuthProvider>
      {showNav && <Navbar />}
      <Component {...pageProps} />
      {/* Không còn Footer */}
    </AuthProvider>
  );
}

export default MyApp;
