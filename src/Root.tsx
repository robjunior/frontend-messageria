import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OrgsPage from "./pages/OrgsPage";
import MessagesPage from "./pages/MessagesPage";
import { useAuthStore } from "./store/auth";
import TopBar from "./components/TopBar";
import UserMenu from "./components/UserMenu";

const Root: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <BrowserRouter>
      {user && (
        <TopBar
          logo={<img src="/vite.svg" alt="Logo" style={{ height: 32 }} />}
          menus={
            <>
              {/* Exemplo de menus, ajuste conforme necessário */}
              <a href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </a>
              <a href="/messages">
                <Button variant="ghost">Mensagens</Button>
              </a>
              <a href="/orgs">
                <Button variant="ghost">Organizações</Button>
              </a>
            </>
          }
          userMenu={
            <UserMenu
              name={user.name}
              onLogout={logout}
              onAccountSettings={() => {
                // Exemplo: redirecionar para configurações de conta
                window.location.href = "/conta";
              }}
            />
          }
        />
      )}
      <Routes>
        {!user && <Route path="*" element={<AuthPage />} />}
        {user && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orgs" element={<OrgsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
