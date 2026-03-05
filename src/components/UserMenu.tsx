import React from "react";
import {
  Box,
  Text,
  Inline,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
  Button,
  IconChevronDown,
} from "braid-design-system";

interface UserMenuProps {
  name: string;
  photoUrl?: string;
  onLogout: () => void;
  onAccountSettings: () => void;
}

function getInitial(name: string) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function getFirstName(name: string) {
  if (!name) return "";
  return name.trim().split(" ")[0];
}

const UserMenu: React.FC<UserMenuProps> = ({
  name,
  photoUrl,
  onLogout,
  onAccountSettings,
}) => {
  const initial = getInitial(name);
  const firstName = getFirstName(name);

  return (
    <DropdownMenu
      label="Menu do usuário"
      trigger={
        <Button variant="ghost" tone="neutral" iconAfter={<IconChevronDown />}>
          <Inline space="small" align="center">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              background="neutralLight"
              width={32}
              height={32}
              overflow="hidden"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <Text weight="bold" size="large" align="center">
                  {initial}
                </Text>
              )}
            </Box>
            <Text>{firstName}</Text>
          </Inline>
        </Button>
      }
    >
      <DropdownMenuItem onClick={onAccountSettings}>
        Configurações de conta
      </DropdownMenuItem>
      <DropdownMenuDivider />
      <DropdownMenuItem onClick={onLogout} tone="critical">
        Sair
      </DropdownMenuItem>
    </DropdownMenu>
  );
};

export default UserMenu;
