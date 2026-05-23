import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth_credentials';

const restoreCredentials = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { username, password } = JSON.parse(stored);
      const token = btoa(`${username}:${password}`);
      axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
      return { username, password };
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || '/tasks';
const AUTH_TIMEOUT = 5000;

const verifyCredentials = async (username, password) => {
  const token = btoa(`${username}:${password}`);
  await axios.get(API_BASE_URL, {
    headers: { 'Authorization': `Basic ${token}` },
    timeout: AUTH_TIMEOUT,
  });
};

export const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(restoreCredentials);
  const logoutRef = useRef(null);

  const logout = useCallback(() => {
    delete axios.defaults.headers.common['Authorization'];
    sessionStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
  }, []);

  logoutRef.current = logout;

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401 && logoutRef.current) {
          logoutRef.current();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    await verifyCredentials(username, password);
    const token = btoa(`${username}:${password}`);
    axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
    const creds = { username, password };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
    setCredentials(creds);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!credentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
