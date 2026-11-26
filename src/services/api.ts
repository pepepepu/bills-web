export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://bills-api-yokx.onrender.com/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Query = Record<string, string | undefined>;

/** fetch autenticado com o token salvo pelo AuthContext. */
export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Query } = {},
): Promise<T> {
  const token = localStorage.getItem("@Bills:token");
  const params = new URLSearchParams();
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();

  const response = await fetch(`${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    window.dispatchEvent(new Event("bills:unauthorized"));
  }

  if (!response.ok) {
    throw new ApiError(
      (data as { error?: string }).error || "Não foi possível completar a ação.",
      response.status,
    );
  }

  return data as T;
}
