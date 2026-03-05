import React from "react";
import {
  Box,
  Inline,
  Button,
  Text,
  Hidden,
  Divider,
} from "braid-design-system";

interface TopBarProps {
  logo: React.ReactNode;
  menus: React.ReactNode;
  userMenu: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ logo, menus, userMenu }) => {
  return (
    <Box
      as="header"
      background="body"
      boxShadow="border"
      paddingY="medium"
      paddingX={{ mobile: "medium", tablet: "large" }}
      display="flex"
      alignItems="center"
      width="full"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        minHeight: 64,
      }}
    >
      {/* Logo à esquerda */}
      <Box minWidth={120} display="flex" alignItems="center">
        {logo}
      </Box>

      {/* Menus centralizados */}
      <Box flexGrow={1} display="flex" justifyContent="center">
        <Hidden below="tablet">
          <Inline space="large" align="center">
            {menus}
          </Inline>
        </Hidden>
      </Box>

      {/* UserMenu à direita */}
      <Box
        minWidth={120}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {userMenu}
      </Box>
    </Box>
  );
};

export default TopBar;
