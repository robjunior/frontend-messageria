import React, { useMemo } from "react";
import { Box, Text, Inline, OverflowMenu, Button } from "braid-design-system";

interface UserMenuProps {
  name: string;
  photoUrl?: string;
  onLogout: () => void;
  onAccountSettings: () => void;
}

const AVATAR_SIZE = 32;

function getInitial(name: string) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function getFirstName(name: string) {
  if (!name) return "";
  return name.trim().split(" ")[0];
}

const UserAvatar: React.FC<{ name: string; photoUrl?: string }> = ({
  name,
  photoUrl,
}) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="neutralLight"
    overflow="hidden"
    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
  >
    {photoUrl ? (
      <img
        src={photoUrl}
        alt={name ? `Avatar de ${name}` : ""}
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    ) : (
      getInitial(name)
    )}
  </Box>
);

const UserMenu: React.FC<UserMenuProps> = ({
  name,
  photoUrl,
  onLogout,
  onAccountSettings,
}) => {
  // Memoize derived values for performance (optional here)
  const firstName = useMemo(() => getFirstName(name), [name]);

  return (
    <OverflowMenu
      label="Menu do usuário"
      trigger={(triggerProps) => (
        <Button variant="ghost" tone="neutral" {...triggerProps}>
          <Inline space="small" align="center">
            <UserAvatar name={name} photoUrl={photoUrl} />
          </Inline>
        </Button>
      )}
      items={[
        {
          label: "Configurações de conta",
          onClick: onAccountSettings,
        },
        {
          label: "Sair",
          onClick: onLogout,
          tone: "critical",
        },
      ]}
    />
  );
};

export default UserMenu;
