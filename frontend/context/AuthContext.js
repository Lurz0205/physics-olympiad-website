// physics-olympiad-website/frontend/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // MỚI: Trạng thái loading của auth
  const router = useRouter();

  // Hàm này sẽ được gọi khi đăng nhập và khi khởi động ứng dụng
  const loadUserFromToken = useCallback(async (authToken) => {
    if (authToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setToken(authToken);
          localStorage.setItem('token', authToken);
          console.log('User loaded from token:', data);
        } else {
          // Token không hợp lệ hoặc hết hạn
          console.error('Token invalid or expired. Logging out.');
          logout(); // Tự động đăng xuất nếu token không hợp lệ
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        logout(); // Đăng xuất nếu có lỗi mạng hoặc lỗi khác
      }
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
    setAuthLoading(false); // Hoàn thành tải, dù thành công hay thất bại
  }, []);

  // useEffect để chạy một lần khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      loadUserFromToken(storedToken);
    } else {
      setAuthLoading(false); // Không có token, kết thúc loading ngay lập tức
    }
  }, [loadUserFromToken]); // Phụ thuộc vào loadUserFromToken

  const login = async (email, password) => {
    setAuthLoading(true); // Bắt đầu loading khi cố gắng đăng nhập
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      await loadUserFromToken(data.token); // Tải người dùng và lưu token
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Đã xảy ra lỗi không xác định.'); // Thêm state error nếu muốn hiển thị trên form
      throw err; // Ném lỗi để component gọi có thể bắt
    } finally {
      setAuthLoading(false); // Kết thúc loading
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const value = {
    user,
    token,
    authLoading, // MỚI: Export authLoading
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
