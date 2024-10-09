import { sql } from "~/database.server";

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

export async function create({
  project_id,
  version,
  prompt,
}: Pick<Preview, "project_id" | "version" | "prompt">) {
  const preview = await sql<Array<{ id: Preview["id"] }>>`
    INSERT INTO preview_ (project_id, version, prompt)
    VALUES (${project_id}, ${version}, ${prompt})
    RETURNING id
  `;

  return preview[0];
}

export async function udpate_code({ id, code }: Pick<Preview, "id" | "code">) {
  await sql`
    UPDATE preview_ set code = ${code}
    WHERE id = ${id}
  `;
}
