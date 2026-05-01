import React from 'react';
import {
  apiGet,
  apiPost,
  clearToken,
  getToken,
  setToken,
} from '@/lib/apiClient';

const AuthContext = React.createContext({
  user: null,
  isInitializing: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [isInitializing, setIsInitializing] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setIsInitializing(false);
      return undefined;
    }

    apiGet('/api/admin/session')
      .then((response) => {
        if (cancelled) return;
        setUser(response.user || null);
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(async (credentials) => {
    const response = await apiPost('/api/admin/login', credentials);
    setToken(response.token);
    setUser(response.user || { username: credentials.username });
    return response;
  }, []);

  const logout = React.useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isInitializing, login, logout }),
    [user, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
