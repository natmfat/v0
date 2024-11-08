import { RemixLoader } from "remix-endpoint";
import { html } from "remix-utils/responses";
import { z } from "zod";
import { shitgen } from "~/.server/database/client";
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
    handler: async ({ params: { projectId: project_id, version } }) => {
      const preview = await shitgen.preview.find({
        select: ["code"],
        where: { project_id, version },
      });
      requireTruthy(preview && preview.code, "expected to find preview");
      return html(generateCode(preview.code));
    },
  })
  .create();
