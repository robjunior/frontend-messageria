import React, { useState } from "react";
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Text,
  Heading,
} from "braid-design-system";
import { useAuthStore } from "../store/auth";

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

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulação de chamada à API (substitua por sua integração real)
      const newOrg: Org = {
        id: Math.random().toString(36).substring(2, 10),
        name: form.name,
        description: form.description,
        ownerUserId: user?.id || "",
      };
      setOrgs((prev) => [...prev, newOrg]);
      setForm({ name: "", description: "" });
      setSuccess("Organização criada com sucesso!");
    } catch {
      setError("Erro ao criar organização.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Card>
          <Stack space="large" align="center">
            <Heading level="3">Acesso negado</Heading>
            <Text>Você precisa estar logado para acessar as organizações.</Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      background="body"
    >
      <Card>
        <Stack space="large" style={{ minWidth: 340, maxWidth: 420 }}>
          <Heading level="2" align="center">
            Organizações
          </Heading>
          {/* Formulário de criação */}
          <form onSubmit={handleCreateOrg}>
            <Stack space="medium">
              <TextField
                label="Nome da Organização"
                id="org-name"
                name="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <TextField
                label="Descrição (opcional)"
                id="org-description"
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
              {error ? (
                <Text tone="critical" align="center">
                  {error}
                </Text>
              ) : null}
              {success ? (
                <Text tone="positive" align="center">
                  {success}
                </Text>
              ) : null}
              <Button type="submit" loading={loading} variant="solid">
                {loading ? "Criando..." : "Criar Organização"}
              </Button>
            </Stack>
          </form>
          {/* Lista de organizações */}
          <Stack space="medium">
            <Heading level="3">Minhas Organizações</Heading>
            {orgs.length === 0 ? (
              <Text align="center" tone="secondary">
                Nenhuma organização cadastrada.
              </Text>
            ) : (
              <Stack space="small">
                {orgs.map((org) => (
                  <Card key={org.id} background="neutralLight">
                    <Stack space="xsmall">
                      <Text weight="bold">{org.name}</Text>
                      {org.description && (
                        <Text size="small" tone="secondary">
                          {org.description}
                        </Text>
                      )}
                      <Text size="xsmall" tone="secondary">
                        ID: {org.id}
                      </Text>
                      <Text size="xsmall" tone="secondary">
                        Líder:{" "}
                        {org.ownerUserId === user.id ? "Você" : org.ownerUserId}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default OrgsPage;
