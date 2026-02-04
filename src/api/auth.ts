import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/auth/register`,
    payload,
  );
  return response.data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    payload,
  );
  // Após login, configurar o JWT no axios para futuras requisições
  setAuthToken(response.data.token);
  return response.data;
}

// Utilitário para configurar o JWT no axios
export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
