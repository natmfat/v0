import { RemixAction } from "remix-endpoint";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ModelPreview } from "~/.server/models";
import { requireTruthy, standard } from "~/lib/utils.server";

import { ActionIntent } from "./types";

export const action = new RemixAction()
  .register({
    method: "POST",
    intent: ActionIntent.NEW_VERSION,
    validate: {
      params: z.object({ projectId: z.string() }),
      formData: zfd.formData({ prompt: zfd.text() }),
    },
    /**
     * Creates a new version
     * Should be followed by a get request to "GET" the code
     */
    handler: async ({
      params: { projectId: project_id },
      formData: { prompt },
    }) => {
      const preview = await ModelPreview.findLatestVersion({ project_id });
      requireTruthy(preview, "expected a preview");
      const nextVersion = preview.version + 1;
      try {
        await ModelPreview.create({
          project_id,
          version: nextVersion,
          prompt,
          code: "",
        });
      } catch (error) {
        return standard(false, "failed to create preview");
      }

      return standard(true, "created new model preview", {
        version: nextVersion,
      });
    },
  })
  .create();
