import React from "react";
import { Box, Inline, Hidden } from "braid-design-system";

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
      boxShadow="borderNeutral"
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
      <Box display="flex" alignItems="center">
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
      <Box display="flex" alignItems="center" justifyContent="flexEnd">
        {userMenu}
      </Box>
    </Box>
  );
};

export default TopBar;
