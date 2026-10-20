import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthContextData } from "../interfaces/auth";

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }

  return context;
}
