import React, { createContext, useState, useEffect } from "react";
import type {
  AuthContextData,
  Member,
  LoginRequest,
  RegisterRequest,
} from "../interfaces/auth";
import { loginService, registerService } from "../services/authServices";

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(() => {
    const storagedUser = localStorage.getItem("@Bills:user");
    return storagedUser ? JSON.parse(storagedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("@Bills:token");
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("@Bills:token", token);
      localStorage.setItem("@Bills:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("@Bills:token");
      localStorage.removeItem("@Bills:user");
    }
  }, [token, user]);

  const clearError = () => {
    setError(null);
  };

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      if (!credentials.email.includes("@")) {
        throw new Error("Insira um endereço de e-mail válido.");
      }

      if (credentials.password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      }

      const response = await loginService(credentials);

      setUser(response.member);
      setToken(response.token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      if (!data.name.trim()) {
        throw new Error("O nome é obrigatório.");
      }

      if (!data.email.includes("@")) {
        throw new Error("Insira um endereço de e-mail válido.");
      }

      if (data.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
      }

      if (data.monthlyIncome < 0 || isNaN(data.monthlyIncome)) {
        throw new Error("Informe uma renda válida.");
      }

      const response = await registerService(data);

      setUser(response.member);
      setToken(response.token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@Bills:token");
    localStorage.removeItem("@Bills:user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
