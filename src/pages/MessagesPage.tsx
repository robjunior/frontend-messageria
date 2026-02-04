import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { getLocalOrgs } from "../api/orgs";
import axios from "axios";

// Tipos
type Channel = "whatsapp" | "sms";

interface ScheduledMessage {
  id: string;
  recipient: string;
  message: string;
  sendAt: number;
  channel: Channel;
}

interface MessageFormState {
  recipient: string;
  message: string;
  sendAt: string; // ISO string para input datetime-local
  channel: Channel;
}

const initialFormState: MessageFormState = {
  recipient: "",
  message: "",
  sendAt: "",
  channel: "whatsapp",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const MessagesPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Organização selecionada (tenant)
  const orgs = getLocalOrgs();
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    orgs.length > 0 ? orgs[0].id : "",
  );

  // Mensagens agendadas
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulário
  const [form, setForm] = useState<MessageFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar mensagens agendadas
  useEffect(() => {
    if (!selectedOrgId) return;
    setLoading(true);
    setError(null);
    axios
      .get<{ data?: ScheduledMessage[]; messages?: ScheduledMessage[] }>(
        `${API_URL}/scheduled`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": selectedOrgId,
          },
        },
      )
      .then((res) => {
        // API pode retornar em "data" ou "messages"
        setMessages(res.data.data || res.data.messages || []);
      })
      .catch(() => setError("Erro ao carregar mensagens agendadas."))
      .finally(() => setLoading(false));
  }, [selectedOrgId, token]);

  // Handlers de formulário
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submissão do formulário (criar ou editar)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      recipient: form.recipient,
      message: form.message,
      sendAt: new Date(form.sendAt).getTime(),
      channel: form.channel,
    };

    try {
      if (editingId) {
        // Editar mensagem agendada
        const res = await axios.put<{ data: ScheduledMessage }>(
          `${API_URL}/scheduled/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-tenant-id": selectedOrgId,
            },
          },
        );
        setMessages((msgs) =>
          msgs.map((msg) => (msg.id === editingId ? res.data.data : msg)),
        );
        setEditingId(null);
      } else {
        // Criar nova mensagem agendada
        const res = await axios.post<{ id: string; data: ScheduledMessage }>(
          `${API_URL}/scheduled`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-tenant-id": selectedOrgId,
            },
          },
        );
        setMessages((msgs) => [...msgs, { ...payload, id: res.data.id }]);
      }
      setForm(initialFormState);
    } catch (err: unknown) {
      setError("Erro ao salvar mensagem.");
    } finally {
      setLoading(false);
    }
  };

  // Editar mensagem
  const handleEdit = (msg: ScheduledMessage) => {
    setEditingId(msg.id);
    setForm({
      recipient: msg.recipient,
      message: msg.message,
      sendAt: new Date(msg.sendAt).toISOString().slice(0, 16), // para input datetime-local
      channel: msg.channel,
    });
  };

  // Excluir mensagem
  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta mensagem?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/scheduled/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": selectedOrgId,
        },
      });
      setMessages((msgs) => msgs.filter((msg) => msg.id !== id));
    } catch {
      setError("Erro ao excluir mensagem.");
    } finally {
      setLoading(false);
    }
  };

  // Troca de organização
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrgId(e.target.value);
    setMessages([]);
    setForm(initialFormState);
    setEditingId(null);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Acesso negado</h2>
          <p>Você precisa estar logado para acessar as mensagens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Mensagens Agendadas
        </h2>

        {/* Seleção de organização */}
        <div className="mb-6">
          <label
            htmlFor="org-select"
            className="block text-sm font-medium mb-1"
          >
            Organização:
          </label>
          <select
            id="org-select"
            value={selectedOrgId}
            onChange={handleOrgChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          >
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Formulário de mensagem */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium mb-1"
            >
              Destinatário (ex: 5511999999999)
            </label>
            <input
              id="recipient"
              name="recipient"
              type="text"
              value={form.recipient}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label htmlFor="sendAt" className="block text-sm font-medium mb-1">
              Agendar para
            </label>
            <input
              id="sendAt"
              name="sendAt"
              type="datetime-local"
              value={form.sendAt}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label htmlFor="channel" className="block text-sm font-medium mb-1">
              Canal
            </label>
            <select
              id="channel"
              name="channel"
              value={form.channel}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {editingId ? "Salvar Alterações" : "Agendar Mensagem"}
          </button>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </form>

        {/* Lista de mensagens */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Mensagens Agendadas</h3>
          {loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-center">
              Nenhuma mensagem agendada.
            </div>
          ) : (
            <ul className="divide-y">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="py-3 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div>
                      <span className="font-bold">Para:</span> {msg.recipient}
                    </div>
                    <div>
                      <span className="font-bold">Mensagem:</span> {msg.message}
                    </div>
                    <div>
                      <span className="font-bold">Canal:</span> {msg.channel}
                    </div>
                    <div>
                      <span className="font-bold">Agendado para:</span>{" "}
                      {new Date(msg.sendAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      onClick={() => handleEdit(msg)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(msg.id)}
                      disabled={loading}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
