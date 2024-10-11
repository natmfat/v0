import { ModelPreview } from "~/.server/models";
import { notFound, requireTruthy, standard } from "~/lib/utils.server";

import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { z } from "zod";
import { streamResponse } from "./lib/streamResponse";

export const loader = new ResourceBuilder().register({
  method: "GET",
  validate: { params: z.object({ projectId: z.string() }) },
  handler: async ({ params: { projectId: project_id } }) => {
    requireTruthy(project_id, notFound());
    const preview = await ModelPreview.findLatestVersion({ project_id });
    requireTruthy(preview, notFound());

    // @todo probably need a better flag than just code.length === 0 (like "started streaming")
    // 4 now if preview code doesn't exist, we should create that
    if (preview.code.length === 0) {
      return streamResponse(preview.prompt, (code) => {
        ModelPreview.updateCode({
          project_id,
          version: preview.version,
          code,
        });
      });
    }

    return standard(true, "Latest version already has code.");
  },
}).create();
