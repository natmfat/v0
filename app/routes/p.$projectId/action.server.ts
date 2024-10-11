// import { redirect } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ModelPreview } from "~/.server/models";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { requireTruthy, standard } from "~/lib/utils.server";

// import { createRoute } from ".";

export const action = new ResourceBuilder()
  .register({
    method: "POST",
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
      context: { request },
    }) => {
      requireTruthy(project_id, "expected project id");
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
