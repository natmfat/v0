import { sql } from "~/.server/database";

export type Palette = {
  id: number;
  name: string;
  thumbnail_colors: string[];
  raw_css: string;
};

export async function create({
  name,
  thumbnail_colors,
  raw_css,
}: Pick<Palette, "name" | "thumbnail_colors" | "raw_css">) {
  await sql`
    INSERT INTO palette_ (name, thumbnail_colors, raw_css)
    VALUES (${name}, ${thumbnail_colors}, ${raw_css})
  `;
}

export async function findAll() {
  const palettes = await sql<Palette[]>`SELECT * FROM palette_`;

  return palettes;
}
