import { ReactNode, createContext, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Preview } from "~/.server/models/ModelPreview";
import { Nullable } from "~/lib/type";

export enum Layout {
  DESKTOP = "desktop",
  TABLET = "tablet",
  MOBILE = "mobile",
  FULL_SCREEN = "fullscreen",
}

type State = {
  projectId: string;

  /** version 0 query that the user submitted */
  initialPrompt: string;

  previews: Array<Preview & { loading?: boolean }>;
  selectedVersion: number;
  layout: `${Layout}`;

  loading?: boolean;

  pickerEnabled: boolean;
  pickerSelectedElement: Nullable<string>;
};

type Action = {
  setSelectedVersion: (version: number) => void;

  // @todo add preview, set picker enabled, set selected element, setlayout, and so on
};

export type ProjectStore = ReturnType<typeof createProjectStore>;

export const createProjectStore = (initialState: Partial<State>) =>
  create<State & Action>()(
    immer((set) => ({
      projectId: "",
      previews: [],
      selectedVersion: 0,
      layout: Layout.DESKTOP,
      initialPrompt: "",
      pickerEnabled: false,
      pickerSelectedElement: null,
      loading: true,
      ...initialState,
      setSelectedVersion: (version) =>
        set((state) => {
          state.selectedVersion = version;
        }),
    })),
  );

const ProjectStoreContext = createContext<Nullable<ProjectStore>>(null);

export const ProjectStoreProvider = ({
  children,
  value,
}: {
  children?: ReactNode;
  value: Partial<State>;
}) => {
  const store = useRef(createProjectStore(value)).current;
  return (
    <ProjectStoreContext.Provider value={store}>
      {children}
    </ProjectStoreContext.Provider>
  );
};

export function useProjectStore<T>(selector: (state: State & Action) => T): T {
  const store = useContext(ProjectStoreContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  return useStore(store, selector);
}
