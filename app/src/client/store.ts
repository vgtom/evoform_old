<<<<<<< HEAD
import { Field, Form, Option, File } from "wasp/entities";
=======
import { Field, Form, Option } from "wasp/entities";
>>>>>>> main
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
<<<<<<< HEAD
    coverImage?: File | null ;
=======
>>>>>>> main
  })[];
};

type FormBuilderStoreState = {
<<<<<<< HEAD
  storedForm: FormWithFields | null;
=======
  storedEdittingFormId: string | null;
  storedForm: FormWithFields | null;
  updateEdittingFormId: (id: string) => void
>>>>>>> main
  updateStoredForm: (updatedForm: FormWithFields | null) => void;
};

export const useFormBuilderStore = create<FormBuilderStoreState>()(
  persist(
    (set) => ({
      storedEdittingFormId: null,
      storedForm: null,
<<<<<<< HEAD
      updateStoredForm: (updatedForm) =>
        set({ storedForm: updatedForm }),
=======
      updateEdittingFormId: (id) => set({ storedEdittingFormId: id  }),
        updateStoredForm: (updatedForm) => 
        set({ storedForm: updatedForm, storedEdittingFormId: updatedForm?.id }),
>>>>>>> main
    }),
    {
      name: "formbuilder-store", // storage key
    }
  )
);
