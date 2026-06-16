import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { AuthContextType, AuthResponse, LoginRequest, RegisterRequest, User } from '../types/authTypes/auth';
import { authService } from '../services/AuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.login(credentials);
      const { token, ...userData } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.register(userData);
      const { token, ...userInfo } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

    const updateUser = (updatedUser: Partial<User>): void => {
    if (user) {
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    setUser,

  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};