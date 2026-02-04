import React, { useEffect, useState } from "react";
import { useOrgStore } from "../store/org";
import { useAuthStore } from "../store/auth";
import { getLocalOrgs } from "../api/orgs";
import { useNavigate } from "react-router-dom";

const OrgSelectorDropdown: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const orgs = useOrgStore((state) => state.orgs);
  const selectedOrgId = useOrgStore((state) => state.selectedOrgId);
  const selectOrg = useOrgStore((state) => state.selectOrg);
  const setOrgs = useOrgStore((state) => state.setOrgs);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Carrega organizações do usuário ao montar
  useEffect(() => {
    if (user) {
      const allOrgs = getLocalOrgs();
      const userOrgs = allOrgs.filter((org) => org.ownerUserId === user.id);
      setOrgs(userOrgs);
      // Se não houver org selecionada, seleciona a primeira
      if (userOrgs.length > 0 && !selectedOrgId) {
        selectOrg(userOrgs[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelect = (orgId: string) => {
    selectOrg(orgId);
    setDropdownOpen(false);
  };

  const handleCreateOrg = () => {
    setDropdownOpen(false);
    navigate("/orgs");
  };

  if (!user) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        {orgs.length > 0
          ? orgs.find((org) => org.id === selectedOrgId)?.name ||
            "Selecione uma organização"
          : "Nenhuma organização"}
        <svg
          className="ml-2 -mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="origin-top-right absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {orgs.length > 0 ? (
              orgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelect(org.id)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    org.id === selectedOrgId
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {org.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                Nenhuma organização encontrada.
              </div>
            )}
            <div className="border-t my-1" />
            <button
              onClick={handleCreateOrg}
              className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
            >
              + Criar nova organização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSelectorDropdown;
