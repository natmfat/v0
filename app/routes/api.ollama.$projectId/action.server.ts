import { ModelPreview } from "~/.server/models";
import { notFound, requireTruthy } from "~/lib/utils.server";

import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { z } from "zod";
import { redirect } from "@remix-run/node";
import { createRoute as createProjectRoute } from "../p.$projectId";
// import { zfd } from "zod-form-data";

export const action = new ResourceBuilder().register({
  method: "POST",
  validate: {
    params: z.object({ projectId: z.string() }),
    body: z.object({
      prompt: z.string(),
      redirectTo: z.string().optional(),
    }),
  },
  /**
   * Creates a new version
   * Should be followed by a get request to "GET" the code
   */
  handler: async (
    {
      params: { projectId: project_id },
      body: { prompt, redirectTo },
      context: { request },
    },
  ) => {
    requireTruthy(project_id, notFound());
    const preview = await ModelPreview.findLatestVersion({ project_id });
    requireTruthy(preview, notFound());
    await ModelPreview.create({
      project_id,
      version: preview.version + 1,
      prompt,
      code: "",
    });
    return redirect(
      redirectTo ||
        request.headers.get("Referer") ||
        createProjectRoute(project_id),
    );
  },
}).create();
