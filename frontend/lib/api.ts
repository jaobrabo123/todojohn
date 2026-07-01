import type {
  AuthResponse,
  CreateTarefaPayload,
  LoginPayload,
  RegisterPayload,
  Tarefa,
  UpdateTarefaPayload,
  Usuario,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const TOKEN_KEY = "todojohn_token";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  // O backend responde 204 sem corpo em alguns casos (ex: DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(" ")
      : body?.message ?? "Ocorreu um erro inesperado. Tente novamente.";
    throw new ApiError(message, response.status);
  }

  return body as T;
}

// ---- Autenticação ----

export function register(payload: RegisterPayload) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function login(payload: LoginPayload) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function googleLoginUrl() {
  return `${API_URL}/auth/google`;
}

export function getMe() {
  return request<Usuario>("/usuarios/me");
}

export function deleteAccount() {
  return request<void>("/usuarios/me", {
    method: "DELETE",
  });
}

// ---- Tarefas ----

export function listTarefas(nome?: string) {
  const query = nome ? `?nome=${encodeURIComponent(nome)}` : "";
  return request<Tarefa[]>(`/tarefas${query}`);
}

export function getTarefa(id: string) {
  return request<Tarefa>(`/tarefas/${id}`);
}

export function createTarefa(payload: CreateTarefaPayload) {
  return request<Tarefa>("/tarefas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTarefa(id: string, payload: UpdateTarefaPayload) {
  return request<Tarefa>(`/tarefas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTarefa(id: string) {
  return request<void>(`/tarefas/${id}`, {
    method: "DELETE",
  });
}
