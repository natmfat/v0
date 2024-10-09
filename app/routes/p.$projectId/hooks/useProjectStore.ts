import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Nullable } from "~/lib/type";

export type Preview = {
  /* Code iteration  */
  version: number;

  /* Prompt used to generate component */
  prompt: string;

  /* Ollama generated code  */
  code: string;

  /* Is the preview loading (due to streaming or generating preview) */
  loading?: boolean;

  /* Preview image  */
  preview: {
    src: string;
    alt: string;
  };
};

export enum Layout {
  DESKTOP = "desktop",
  TABLET = "tablet",
  MOBILE = "mobile",
  FULL_SCREEN = "fullscreen",
}

type State = {
  /** version 0 query that the user submitted */
  initialPrompt: string;

  /**  */
  history: Preview[];
  selectedVersion: number;
  layout: `${Layout}`;

  pickerEnabled: boolean;
  pickerSelectedElement: Nullable<string>;
};

type Action = {
  setSelectedVersion: (version: number) => void;

  // @todo add preview, set picker enabled, set selected element, setlayout, and so on
};

export const useProjectStore = create<State & Action>()(
  immer((set) => ({
    history: [],
    selectedVersion: 0,
    layout: Layout.DESKTOP,
    initialPrompt: "",
    pickerEnabled: false,
    pickerSelectedElement: null,
    setSelectedVersion: (version) =>
      set((state) => {
        state.selectedVersion = version;
      }),
  })),
);

// @todo postgres actually save projects, previews, and stuff
