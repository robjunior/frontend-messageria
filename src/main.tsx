import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import { useAuthStore } from "./store/auth";

function Root() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {!user && <Route path="/register" element={<RegisterPage />} />}
        {/* Outras rotas protegidas ou públicas */}
        <Route
          path="*"
          element={user ? <App /> : <Navigate to="/register" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
