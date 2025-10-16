import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

type User = { id: number; email: string; role?: string } | null;

const AuthContext = createContext({
  user: null as User,
  login: async (email: string, password: string) => {},
  register: async (email: string, password: string) => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get('/Auth/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    load();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/Auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    const me = await api.get('/Auth/me');
    setUser(me.data);
  };

  const register = async (email: string, password: string) => {
    await api.post("/Auth/register", { email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
