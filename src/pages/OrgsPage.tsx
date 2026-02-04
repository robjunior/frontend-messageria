import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/auth";

// Tipos
interface Org {
  id: string;
  name: string;
  description?: string;
  ownerUserId: string;
}

interface CreateOrgPayload {
  name: string;
  description?: string;
}

// Componente principal
const OrgsPage: React.FC = () => {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [form, setForm] = useState<CreateOrgPayload>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Função para criar organização
  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/orgs",
        { name: form.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newOrg: Org = {
        ...response.data.org,
        description: form.description,
      };
      setOrgs((prev) => [...prev, newOrg]);
      setForm({ name: "", description: "" });
      setSuccess("Organização criada com sucesso!");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // @ts-expect-error: err.response pode existir em erros do axios
        err.response?.data?.message
      ) {
        // @ts-expect-error: err.response pode existir em erros do axios
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar organização.");
      }
    } finally {
      setLoading(false);
    }
  };

  // (Opcional) Função para listar organizações do usuário (simulação local)
  // Em produção, troque por um endpoint real se existir
  // useEffect(() => {
  //   // Buscar organizações do usuário logado
  // }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Acesso negado</h2>
          <p>Você precisa estar logado para acessar as organizações.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Organizações</h2>

        {/* Formulário de criação */}
        <form onSubmit={handleCreateOrg} className="space-y-4 mb-8">
          <div>
            <label
              htmlFor="org-name"
              className="block text-sm font-medium mb-1"
            >
              Nome da Organização
            </label>
            <input
              id="org-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="org-description"
              className="block text-sm font-medium mb-1"
            >
              Descrição (opcional)
            </label>
            <input
              id="org-description"
              name="description"
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar Organização"}
          </button>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}
        </form>

        {/* Lista de organizações */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Minhas Organizações</h3>
          {orgs.length === 0 ? (
            <div className="text-gray-500 text-center">
              Nenhuma organização cadastrada.
            </div>
          ) : (
            <ul className="divide-y">
              {orgs.map((org) => (
                <li key={org.id} className="py-3 flex flex-col">
                  <span className="font-bold">{org.name}</span>
                  {org.description && (
                    <span className="text-sm text-gray-600">
                      {org.description}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">ID: {org.id}</span>
                  <span className="text-xs text-gray-400">
                    Líder:{" "}
                    {org.ownerUserId === user.id ? "Você" : org.ownerUserId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgsPage;
