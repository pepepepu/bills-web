export interface Member {
  id: string;
  houseId: string;
  name: string;
  email: string;
  monthlyIncome: number;
  pixKey?: string | null;
  role: "admin" | "resident";
  createdAt?: string;
}

export interface RegisterRequest {
  houseName?: string;
  houseId?: string;
  name: string;
  email: string;
  password: string;
  monthlyIncome: number;
  pixKey?: string;
  role?: "admin" | "resident";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  member: Member;
  token: string;
}

export interface AuthContextData {
  user: Member | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
