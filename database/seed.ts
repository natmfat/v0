import { ModelPalette } from "~/.server/models";

await initPalettes();
process.exit(0);

/* Create color palettes  */
async function initPalettes() {
  await Promise.all(
    [
      {
        name: "Replit Light",
        thumbnail_colors: ["#ebeced", "#fcfcfc", "#6bb5ff", "#0f87ff"],
        raw_css: "",
      },
      {
        name: "Replit Dark",
        thumbnail_colors: ["#0e1525", "#1c2333", "#0053a6", "#0079f2"],
        raw_css: "",
      },
    ].map((props) => ModelPalette.create(props)),
  );
}
