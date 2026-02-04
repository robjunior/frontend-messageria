import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OrgsPage from "./pages/OrgsPage";
import MessagesPage from "./pages/MessagesPage";
import { useAuthStore } from "./store/auth";

const Root: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {!user && <Route path="*" element={<AuthPage />} />}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orgs" element={<OrgsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="*" element={<App />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
