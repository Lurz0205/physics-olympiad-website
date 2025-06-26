// physics-olympiad-website/frontend/components/Layout.js
import Navbar from './Navbar';
import { AuthProvider } from '../context/AuthContext';

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      {/* Thêm class bg-red-200 vào đây để kiểm tra */}
      <div className="min-h-screen flex flex-col bg-red-200">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
          {children}
        </main>
        <footer className="bg-dark text-white p-4 text-center mt-8 rounded-t-lg shadow-inner">
          <p>&copy; 2024 Website Ôn thi Học sinh Giỏi Vật lý. All rights reserved.</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default Layout;
