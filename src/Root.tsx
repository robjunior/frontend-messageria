frontend/src/Root.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
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
            <Route path="*" element={<App />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
