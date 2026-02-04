import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { useAuthStore } from "./store/auth";

function Root() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {!user && <Route path="*" element={<AuthPage />} />}
        {user && <Route path="*" element={<App />} />}
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
