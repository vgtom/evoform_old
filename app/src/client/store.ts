import { create } from "zustand";
import { persist } from "zustand/middleware";

// SIDEBAR
type SidebarStoreState = {
  isSidebarOpened: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useSidebarStore = create<SidebarStoreState>()(
  persist(
    (set) => ({
      isSidebarOpened: true,
      openSidebar: () => set({ isSidebarOpened: true }),
      closeSidebar: () => set({ isSidebarOpened: false }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpened: !state.isSidebarOpened })),
    }),
    {
      name: "sidebar-store", // storage key
    }
  )
);

// WORKSPACE
type WorkspaceStoreState = {
  workSpaceId: string;
  storeWorkSpaceId: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceStoreState>()(
  persist(
    (set) => ({
      workSpaceId: "",
      storeWorkSpaceId: (id) => set({ workSpaceId: id }),
    }),
    {
      name: "workspace-store", // storage key
    }
  )
);
