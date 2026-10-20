import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../interfaces/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://bills-api-yokx.onrender.com/api";

export async function loginService(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/members/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível realizar o login.");
  }

  return data;
}

export async function registerService(
  userData: RegisterRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/members/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível concluir o cadastro.");
  }

  return data;
}

export async function getMeService(token: string): Promise<{ user: any }> {
  const response = await fetch(`${API_BASE_URL}/members/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Sessão inválida ou expirada.");
  }

  return data;
}
