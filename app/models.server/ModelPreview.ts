import { sql } from "~/database.server";

export type Preview = {
  id: number;
  project_id: number;
  version: number;
  prompt: string;
  code: string;
  thumbnail_src: string;
};

export async function create({
  project_id,
  version,
  prompt,
}: Pick<Preview, "project_id" | "version" | "prompt">) {
  const preview = await sql`
    INSERT INTO preview_ (project_id, version, prompt)
    VALUES (${project_id}, ${version}, ${prompt})
    RETURNING id
  `;

  return preview;
}

export async function udpate_code({ id, code }: Pick<Preview, "id" | "code">) {
  await sql`
    UPDATE preview_ set code = ${code}
    WHERE id = ${id}
  `;
}
