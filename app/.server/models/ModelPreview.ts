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
  `;
  return previews;
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

export async function create({
  project_id,
  version,
  prompt,
  code,
}: Pick<Preview, "project_id" | "version" | "prompt" | "code">) {
  const preview = await sql<Array<Pick<Preview, "id">>>`
    INSERT INTO preview_ (project_id, version, prompt, code)
    VALUES (${project_id}, ${version}, ${prompt}, ${code})
    RETURNING id
  `;

  return preview[0];
}

export async function updateCode({
  project_id,
  version,
  code,
}: Pick<Preview, "project_id" | "version" | "code">) {
  await sql`
    UPDATE preview_ SET code = ${code}
    WHERE project_id = ${project_id} AND version = ${version}
  `;
}
