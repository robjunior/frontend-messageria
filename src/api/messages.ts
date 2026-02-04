import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Tipos de mensagem e canais
export type Channel = "whatsapp" | "sms";

export interface ScheduledMessage {
  id: string;
  recipient: string;
  message: string;
  sendAt: number; // timestamp (ms)
  channel: Channel;
  [key: string]: any; // Para campos extras do backend
}

export interface DeliveredMessage {
  id: string;
  recipient: string;
  message: string;
  sentAt: number; // timestamp (ms)
  channel: Channel;
  [key: string]: any;
}

export interface FailedMessage {
  id: string;
  recipient: string;
  message: string;
  failedAt: number; // timestamp (ms)
  channel: Channel;
  error?: string;
  [key: string]: any;
}

// --- Scheduled Messages ---

// Lista todas as mensagens agendadas do tenant
export async function getScheduledMessages(
  orgId: string,
  token: string,
): Promise<ScheduledMessage[]> {
  const response = await axios.get<{
    data?: ScheduledMessage[];
    messages?: ScheduledMessage[];
  }>(`${API_URL}/scheduled`, {
    headers: {
      "x-tenant-id": orgId,
      Authorization: `Bearer ${token}`,
    },
  });
  // Suporte a diferentes formatos de resposta
  return response.data.data || response.data.messages || [];
}

// Agenda uma nova mensagem
export interface CreateScheduledPayload {
  recipient: string;
  message: string;
  sendAt: number;
  channel: Channel;
}

export async function createScheduledMessage(
  orgId: string,
  token: string,
  payload: CreateScheduledPayload,
): Promise<ScheduledMessage> {
  const response = await axios.post<{
    success: boolean;
    id: string;
    data: ScheduledMessage;
  }>(`${API_URL}/scheduled`, payload, {
    headers: {
      "x-tenant-id": orgId,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

// Atualiza uma mensagem agendada
export async function updateScheduledMessage(
  orgId: string,
  token: string,
  id: string,
  updates: Partial<CreateScheduledPayload>,
): Promise<ScheduledMessage> {
  const response = await axios.put<{
    success: boolean;
    data: ScheduledMessage;
  }>(`${API_URL}/scheduled/${id}`, updates, {
    headers: {
      "x-tenant-id": orgId,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

// Cancela (deleta) uma mensagem agendada
export async function deleteScheduledMessage(
  orgId: string,
  token: string,
  id: string,
): Promise<{ success: boolean; id: string }> {
  const response = await axios.delete<{ success: boolean; id: string }>(
    `${API_URL}/scheduled/${id}`,
    {
      headers: {
        "x-tenant-id": orgId,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

// --- Delivered Messages ---

export async function getDeliveredMessages(
  token: string,
): Promise<DeliveredMessage[]> {
  const response = await axios.get<{ messages: DeliveredMessage[] }>(
    `${API_URL}/delivered`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.messages;
}

// --- Failed Messages ---

export async function getFailedMessages(
  token: string,
): Promise<FailedMessage[]> {
  const response = await axios.get<{ messages: FailedMessage[] }>(
    `${API_URL}/failed`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data.messages;
}
