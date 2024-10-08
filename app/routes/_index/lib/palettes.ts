export type Palette = {
  name: string;
  colors: string[];
};

export const palettes: Palette[] = [
  {
    name: "Replit Light",
    colors: ["#ebeced", "#fcfcfc", "#6bb5ff", "#0f87ff"],
  },
  {
    name: "Replit Dark",
    colors: ["#0e1525", "#1c2333", "#0053a6", "#0079f2"],
  },
];

export const DEFAULT_PALETTE = palettes[0].name;
