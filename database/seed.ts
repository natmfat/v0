import { sql } from "~/database.server";
import { ModelPalette } from "~/models.server";

await initPalettes();
await initProjects();
await initProjectPreviews();
process.exit(0);

/* Create color palettes  */
async function initPalettes() {
  await sql`CREATE TABLE IF NOT EXISTS palette_ (
    id bigint UNIQUE GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    thumbnail_colors text[],
    raw_css text NOT NULL
  )`;

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

async function initProjects() {
  await sql`CREATE TABLE IF NOT EXISTS project_ (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    palette_id bigint REFERENCES palette_(id) DEFAULT 0,
    prompt text NOT NULL,
    public boolean DEFAULT true
  )`;
}

async function initProjectPreviews() {
  await sql`CREATE TABLE IF NOT EXISTS project_preview_ (
    id bigint UNIQUE GENERATED ALWAYS AS IDENTITY,
    project_id uuid REFERENCES project_(id),
    version smallint DEFAULT 0,
    prompt text NOT NULL,
    code text NOT NULL,
    thumbnail_src text NOT NULL
  )`;
}
