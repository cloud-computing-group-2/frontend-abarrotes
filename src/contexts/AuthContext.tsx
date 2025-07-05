import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import authService, { RegisterData, LoginData } from '../services/authService';

interface User {
  user_id: string;
  tenant_id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user_id: string, tenant_id: string, password: string) => Promise<boolean>;
  register: (user_id: string, tenant_id: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tenantId = localStorage.getItem('tenantId');
    const userId = localStorage.getItem('userId');
    
    if (token && tenantId && userId) {
      setUser({ user_id: userId, tenant_id: tenantId });
    }
  }, []);

  const register = async (user_id: string, tenant_id: string, password: string) => {
    setLoading(true);
    try {
      const { statusCode, body } = await authService.register({ user_id, tenant_id, password });
      console.log('Register response:', { statusCode, body });
      // Considerar exitoso si el statusCode es 200 o 201 (Created)
      return statusCode === 200 || statusCode === 201;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (user_id: string, tenant_id: string, password: string) => {
    setLoading(true);
    try {
      const { statusCode, token } = await authService.login({ user_id, tenant_id, password });
      console.log('Login response:', { statusCode, token });
      if ((statusCode === 200 || statusCode === 201) && token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('tenantId', tenant_id);
        localStorage.setItem('userId', user_id);
        setUser({ user_id, tenant_id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      register, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
