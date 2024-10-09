import { sql } from "~/database.server";
import { Nullable } from "~/lib/type";

import { Palette } from "./ModelPalette";

export type Project = {
  id: string;
  palette_id: number;
  prompt: string;
};

// LEFT JOIN project_preview_ ON project_preview_.project_id = project_.id

export async function find({ id }: Pick<Project, "id">) {
  const project = await sql<
    Array<{
      project_prompt: Project["prompt"];
      palette_name: Palette["name"];
      palette_thumbnail_colors: Palette["thumbnail_colors"];
      palette_raw_css: Palette["thumbnail_colors"];
    }>
  >`
    SELECT project_.prompt AS project_prompt, palette_.name AS palette_name, palette_.thumbnail_colors as palette_thumbnail_colors, palette_.raw_css as palette_raw_css FROM project_
    JOIN palette_ ON project_.palette_id = palette_.id
    WHERE project_.id = ${id};
  `;
  if (project.length === 0) {
    return null;
  }
  return project[0];
}

export async function create({
  prompt,
  palette_id,
}: Pick<Project, "prompt" | "palette_id">) {
  const project = await sql<Project[]>`
    INSERT INTO project_ (prompt, palette_id)
    VALUES (${prompt}, ${palette_id})
    RETURNING id
  `;

  return project[0];
}
