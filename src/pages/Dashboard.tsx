import React from "react";
import { useAuthStore } from "../store/auth";

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    // Opcional: pode redirecionar ou exibir mensagem
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Acesso negado</h2>
          <p>Você precisa estar logado para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
        <div className="mb-4">
          <div className="text-lg">
            <span className="font-semibold">Nome:</span> {user.name}
          </div>
          <div className="text-lg">
            <span className="font-semibold">E-mail:</span> {user.email}
          </div>
          <div className="text-lg">
            <span className="font-semibold">ID:</span> {user.id}
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
