import React, { useState } from "react";
import { useAuthStore } from "../store/auth";
import { getLocalOrgs } from "../api/orgs";
import type { Org } from "../api/orgs";
import { useNavigate } from "react-router-dom";
import UserInfoCard from "../components/UserInfoCard";

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [orgs] = useState<Org[]>(() => {
    if (user) {
      const allOrgs = getLocalOrgs();
      return allOrgs.filter((org) => org.ownerUserId === user.id);
    }
    return [];
  });

  const selectedOrgId = orgs.length > 0 ? orgs[0].id : "";

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
        <UserInfoCard user={user} />
        <div className="mb-6">
          {orgs.length > 0 ? (
            <div>
              <label
                htmlFor="org-select"
                className="block text-sm font-medium mb-1"
              >
                Selecione uma organização:
              </label>
              <select
                id="org-select"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                value={selectedOrgId}
                onChange={() => {}}
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-600 mb-2">
                Você não pertence a nenhuma organização.
              </span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => navigate("/orgs")}
              >
                Criar organização
              </button>
            </div>
          )}
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
