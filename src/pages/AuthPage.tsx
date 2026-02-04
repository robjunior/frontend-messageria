import React, { useState } from "react";
import { registerUser, loginUser } from "../api/auth";
import { useAuthStore } from "../store/auth";

type Mode = "login" | "register";

const initialRegister = {
  name: "",
  email: "",
  password: "",
};

const initialLogin = {
  email: "",
  password: "",
};

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  // Não renderiza se usuário já está logado
  if (user) return null;

  // Handlers para alternância
  const switchTo = (next: Mode) => {
    setError(null);
    setMode(next);
  };

  // Handlers de formulário
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submissão de cadastro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(registerForm);
      // Não há token no cadastro, apenas dados do usuário
      setAuth(response, "");
      // Você pode redirecionar ou exibir mensagem de sucesso aqui
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erro ao cadastrar. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Submissão de login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(loginForm);
      setAuth(response.user, response.token);
      // Você pode redirecionar para a home aqui
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => switchTo("login")}
            disabled={mode === "login"}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => switchTo("register")}
            disabled={mode === "register"}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        {mode === "register" ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-2 text-center">Criar Conta</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={registerForm.name}
                onChange={handleRegisterChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                autoComplete="name"
              />
            </div>
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium mb-1"
              >
                E-mail
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium mb-1"
              >
                Senha
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
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
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-2 text-center">Entrar</h2>
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-1"
              >
                E-mail
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium mb-1"
              >
                Senha
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                autoComplete="current-password"
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
