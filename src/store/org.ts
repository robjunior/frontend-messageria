import { create } from "zustand";

export interface Org {
  id: string;
  name: string;
  description?: string;
  ownerUserId: string;
}

interface OrgState {
  orgs: Org[];
  selectedOrgId: string | null;
  setOrgs: (orgs: Org[]) => void;
  selectOrg: (orgId: string) => void;
  addOrg: (org: Org) => void;
  clear: () => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  orgs: [],
  selectedOrgId: null,
  setOrgs: (orgs) => set({ orgs }),
  selectOrg: (orgId) => set({ selectedOrgId: orgId }),
  addOrg: (org) =>
    set((state) => ({
      orgs: [...state.orgs, org],
      selectedOrgId: org.id,
    })),
  clear: () => set({ orgs: [], selectedOrgId: null }),
}));

// Hidratação inicial do estado a partir do localStorage
const storedOrgs = localStorage.getItem("orgs");
const storedSelectedOrgId = localStorage.getItem("selected_org_id");
if (storedOrgs) {
  useOrgStore.getState().setOrgs(JSON.parse(storedOrgs));
}
if (storedSelectedOrgId) {
  useOrgStore.getState().selectOrg(storedSelectedOrgId);
}

// Persistência automática no localStorage
useOrgStore.subscribe((state) => {
  localStorage.setItem("orgs", JSON.stringify(state.orgs));
  if (state.selectedOrgId) {
    localStorage.setItem("selected_org_id", state.selectedOrgId);
  } else {
    localStorage.removeItem("selected_org_id");
  }
});
