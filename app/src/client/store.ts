import { Field, Form, Option, File } from "wasp/entities";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GetFormBySlugOutput } from "../backend/form/getFormBySlug";

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

// Form Builder

type FormWithFields = Form & {
  fields: (Field & {
    options?: Option[] | null;
    coverImage?: File | null ;
  })[];
};

type FormBuilderStoreState = {
  storedForm: FormWithFields | null;
  updateStoredForm: (updatedForm: FormWithFields | null) => void;
};

export const useFormBuilderStore = create<FormBuilderStoreState>()(
  persist(
    (set) => ({
      storedEdittingFormId: null,
      storedForm: null,
      updateStoredForm: (updatedForm) =>
        set({ storedForm: updatedForm }),
    }),
    {
      name: "formbuilder-store", // storage key
    }
  )
);
