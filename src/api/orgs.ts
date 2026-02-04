import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Tipos de dados
export interface Org {
  id: string;
  name: string;
  description?: string; // Campo opcional para UI, não existe no backend
  ownerUserId: string;
}

export interface Membership {
  userId: string;
  orgId: string;
  role: "admin" | "member";
}

export interface CreateOrgPayload {
  name: string;
  description?: string; // Só para UI/local, não enviado ao backend
}

export interface CreateOrgResponse {
  org: Org;
  membership: Membership;
}

// Cria uma nova organização
export async function createOrg(
  payload: CreateOrgPayload,
  token: string,
): Promise<CreateOrgResponse> {
  const response = await axios.post<CreateOrgResponse>(
    `${API_URL}/orgs`,
    { name: payload.name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  // description não existe no backend, mas pode ser usada localmente
  return {
    ...response.data,
    org: {
      ...response.data.org,
      description: payload.description,
    },
  };
}

// Convida um usuário para uma organização
export interface InvitePayload {
  email: string;
  role: "member" | "admin";
}

export interface InviteResponse {
  invite: any;
  inviteToken: string;
}

export async function inviteToOrg(
  orgId: string,
  payload: InvitePayload,
  token: string,
): Promise<InviteResponse> {
  const response = await axios.post<InviteResponse>(
    `${API_URL}/orgs/${orgId}/invite`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

// Aceita um convite para organização
export interface AcceptInvitePayload {
  inviteToken: string;
}

export interface AcceptInviteResponse {
  orgId: string;
  userId: string;
  role: "member" | "admin";
}

export async function acceptInvite(
  payload: AcceptInvitePayload,
): Promise<AcceptInviteResponse> {
  const response = await axios.post<AcceptInviteResponse>(
    `${API_URL}/orgs/accept-invite`,
    payload,
  );
  return response.data;
}

// (Opcional) Mock para listagem local de organizações (até existir endpoint real)
export function getLocalOrgs(): Org[] {
  const orgs = localStorage.getItem("orgs");
  return orgs ? JSON.parse(orgs) : [];
}

export function saveLocalOrg(org: Org) {
  const orgs = getLocalOrgs();
  orgs.push(org);
  localStorage.setItem("orgs", JSON.stringify(orgs));
}
