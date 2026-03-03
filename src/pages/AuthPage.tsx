import React, { useState } from "react";
import { registerUser, loginUser } from "../api/auth";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Stack,
  Button,
  TextField,
  Text,
  Heading,
  Inline,
} from "braid-design-system";

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
  const navigate = useNavigate();

  if (user) return null;

  const switchTo = (next: Mode) => {
    setError(null);
    setMode(next);
  };

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

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(registerForm);
      setAuth(response, "");
      navigate("/orgs");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // @ts-expect-error: err.response é do tipo desconhecido, pode existir em erros do axios
        err.response?.data?.message
      ) {
        // @ts-expect-error: err.response é do tipo desconhecido, pode existir em erros do axios
        setError(err.response.data.message);
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(loginForm);
      setAuth(response.user, response.token);
      navigate("/orgs");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // @ts-expect-error: err.response é do tipo desconhecido, pode existir em erros do axios
        err.response?.data?.message
      ) {
        // @ts-expect-error: err.response é do tipo desconhecido, pode existir em erros do axios
        setError(err.response.data.message);
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack align="center" space="large" style={{ minHeight: "100vh" }}>
      <Card>
        <Stack space="large">
          <Inline space="small" align="center">
            <Button
              variant={mode === "login" ? "solid" : "ghost"}
              onClick={() => switchTo("login")}
              disabled={mode === "login"}
            >
              Entrar
            </Button>
            <Button
              variant={mode === "register" ? "solid" : "ghost"}
              onClick={() => switchTo("register")}
              disabled={mode === "register"}
            >
              Cadastrar
            </Button>
          </Inline>
          {mode === "register" ? (
            <form onSubmit={handleRegisterSubmit}>
              <Stack space="medium">
                <Heading level="2">Criar Conta</Heading>
                <TextField
                  label="Nome"
                  id="name"
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="name"
                />
                <TextField
                  label="E-mail"
                  id="register-email"
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="email"
                />
                <TextField
                  label="Senha"
                  id="register-password"
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="new-password"
                />
                {error ? (
                  <Text tone="critical" align="center">
                    {error}
                  </Text>
                ) : null}
                <Button type="submit" loading={loading} variant="solid">
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <Stack space="medium">
                <Heading level="2">Entrar</Heading>
                <TextField
                  label="E-mail"
                  id="login-email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="email"
                />
                <TextField
                  label="Senha"
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="current-password"
                />
                {error ? (
                  <Text tone="critical" align="center">
                    {error}
                  </Text>
                ) : null}
                <Button type="submit" loading={loading} variant="solid">
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default AuthPage;
