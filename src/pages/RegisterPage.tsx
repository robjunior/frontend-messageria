import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useAuthStore } from "../store/auth";

interface FormState {
  name: string;
  email: string;
  password: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  password: "",
};

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  // Não renderiza se usuário já está logado
  if (user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(form);
      // Não há token retornado no cadastro, apenas dados do usuário
      // Usuário pode ser redirecionado para login ou logado automaticamente se a API mudar
      setAuth(response, ""); // Sem token por enquanto
      // Aqui você pode redirecionar para a home ou página de login
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erro ao cadastrar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              autoComplete="new-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        {/* Futuramente: botão para alternar para login */}
        {/* <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={onSwitchToLogin}
          >
            Já tem conta? Entrar
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RegisterPage;
