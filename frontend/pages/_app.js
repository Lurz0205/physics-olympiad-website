// frontend/pages/_app.js
import '../styles/globals.css';
import 'katex/dist/katex.min.css'; // Thêm dòng này để import KaTeX CSS
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar'; // Đảm bảo Navbar đã được import
import Footer from '../components/Footer'; // Đảm bảo Footer đã được import
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Danh sách các đường dẫn không hiển thị Navbar và Footer
  const noNavFooterPaths = ['/login', '/register', '/admin', '/admin/users', '/admin/theory', '/admin/exercise', '/admin/tests', '/admin/theory/new', '/admin/exercise/new', '/admin/tests/new', '/admin/theory/[slug]/edit', '/admin/exercise/[slug]/edit', '/admin/tests/[slug]/edit'];
  const showNavFooter = !noNavFooterPaths.some(path => {
    // Để xử lý các đường dẫn động như /admin/theory/[slug]/edit
    if (path.includes('[slug]')) {
      const basepath = path.replace('/[slug]', '');
      return router.pathname.startsWith(basepath);
    }
    return router.pathname === path;
  });

  return (
    <AuthProvider>
      {showNavFooter && <Navbar />}
      <Component {...pageProps} />
      {showNavFooter && <Footer />}
    </AuthProvider>
  );
}

export default MyApp;
