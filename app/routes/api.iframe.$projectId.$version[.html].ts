import { PreviewData } from "database/client";
import { RemixLoader } from "remix-endpoint";
import { html } from "remix-utils/responses";
import { z } from "zod";
import { sql } from "~/.server/database";
import { requireTruthy } from "~/lib/utils.server";

import { generateCode } from "./p.$projectId/lib/generateCode";

export function createRoute(projectId: string, version: number = 0) {
  return `/api/iframe/${projectId}/${version}.html`;
}

export const loader = new RemixLoader()
  .register({
    method: "GET",
    validate: {
      params: z.object({
        projectId: z.string(),
        version: z.number({ coerce: true }),
      }),
    },
    handler: async ({ params: { projectId, version } }) => {
      const preview =
        (
          await sql<Pick<PreviewData, "code">[]>`
            SELECT code FROM preview_
            WHERE project_id = ${projectId} AND version = ${version}
          `
        )[0] || null;
      requireTruthy(preview && preview.code, "expected to find preview");
      return html(generateCode(preview.code));
    },
  })
  .create();
