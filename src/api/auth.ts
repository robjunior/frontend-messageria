frontend/src/api/auth.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

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

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(`${API_URL}/auth/register`, payload);
  return response.data;
}
