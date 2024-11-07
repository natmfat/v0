import { sql } from "~/.server/database";

export type Preview = {
  id: number;
  project_id: string;
  version: number;
  prompt: string;
  code: string;
  thumbnail_src: string;
};

export async function find({ project_id }: Pick<Preview, "project_id">) {
  const previews = await sql<Preview[]>`
    SELECT * FROM preview_
    WHERE project_id = ${project_id}
    ORDER BY version
  `;
  return previews;
}

export async function findByVersion({
  project_id,
  version,
}: Pick<Preview, "project_id" | "version">) {
  const previews = await sql<Preview[]>`
    SELECT * FROM preview_
    WHERE project_id = ${project_id} AND version = ${version}
    ORDER BY version
  `;
  return previews[0] || null;
}

export async function findLatestVersion({
  project_id,
}: Pick<Preview, "project_id">) {
  const previews = await sql<Preview[]>`
    SELECT * from preview_
    WHERE project_id = ${project_id}
    ORDER BY version DESC
    LIMIT 1
  `;
  return previews.length === 0 ? null : previews[0];
}
