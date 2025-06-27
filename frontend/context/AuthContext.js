// frontend/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

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
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', authToken);
          }
          console.log('User loaded from token:', data);
        } else {
          console.error('Token invalid or expired. Logging out.');
          logout();
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        logout();
      }
    } else {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        loadUserFromToken(storedToken);
      } else {
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(false);
    }
  }, [loadUserFromToken]);

  // THAY ĐỔI QUAN TRỌNG: Đổi 'email' thành 'identifier' trong tham số và body
  const login = async (identifier, password) => { 
    setAuthLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }), // Gửi 'identifier' và 'password'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      await loadUserFromToken(data.token);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  const value = {
    user,
    token,
    authLoading,
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
