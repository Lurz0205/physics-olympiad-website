// physics-olympiad-website/frontend/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Tạo Auth Context
const AuthContext = createContext();

// Hook tùy chỉnh để sử dụng Auth Context dễ dàng hơn
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [token, setToken] = useState(null); // Lưu JWT token
  const [loading, setLoading] = useState(true); // Trạng thái tải (đang kiểm tra token ban đầu)
  const router = useRouter();

  useEffect(() => {
    // Hàm này sẽ chạy khi component được mount để kiểm tra token trong localStorage
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user'); // Lấy cả thông tin user đã lưu

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser); // Parse thông tin user từ JSON
          setToken(storedToken);
          setUser(parsedUser); // Đặt thông tin user bao gồm role
        } catch (e) {
          console.error("Lỗi khi parse user từ localStorage:", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false); // Kết thúc quá trình tải
    };

    loadUser();
  }, []);

  // Hàm đăng nhập
  const login = (userData, userToken) => {
    // Đảm bảo userData chứa tất cả các trường cần thiết, bao gồm role
    const userToStore = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user', // Đảm bảo luôn có trường role, mặc định là 'user'
    };
    
    setToken(userToken);
    setUser(userToStore); // Cập nhật state user

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userToStore)); // Lưu user object vào localStorage
  };

  // Hàm đăng xuất
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
  };

  // Giá trị sẽ được cung cấp bởi context
  const authContextValue = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
