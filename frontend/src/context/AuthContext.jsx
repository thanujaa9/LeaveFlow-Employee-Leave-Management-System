import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../services/mockData';
import { setAuthToken, getAuthToken, request } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('leaveflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to David Miller (Employee) for smooth preview
    return INITIAL_USERS[1];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('leaveflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('leaveflow_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Attempt backend API call first
      try {
        const response = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (response && response.token) {
          setAuthToken(response.token);
          const userObj = {
            id: response.userId,
            employeeId: response.employeeCode,
            name: `${response.firstName} ${response.lastName}`,
            email: response.email,
            role: response.role.replace('ROLE_', ''),
            department: response.department,
            designation: response.designation,
            avatar: response.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          };
          setCurrentUser(userObj);
          setLoading(false);
          return userObj;
        }
      } catch (backendError) {
        console.warn('Backend unavailable, falling back to simulated authentication:', backendError.message);
      }

      // Standalone fallback: match email in INITIAL_USERS
      const foundUser = INITIAL_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        throw new Error('Invalid email or password. Please use a demo account.');
      }

      // Generate a mock JWT token
      const mockToken = `mock-jwt-token-${foundUser.role.toLowerCase()}-${Date.now()}`;
      setAuthToken(mockToken);
      setCurrentUser(foundUser);
      setLoading(false);
      return foundUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const loginAsDemo = (role = 'EMPLOYEE') => {
    const targetUser = role === 'ADMIN'
      ? INITIAL_USERS.find((u) => u.role === 'ADMIN')
      : INITIAL_USERS.find((u) => u.role === 'EMPLOYEE' && u.employeeId === 'EMP-1042');
    
    if (targetUser) {
      setAuthToken(`mock-demo-token-${role.toLowerCase()}`);
      setCurrentUser(targetUser);
      return targetUser;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('leaveflow_user');
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isEmployee = currentUser?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        loginAsDemo,
        logout,
        isAdmin,
        isEmployee,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
