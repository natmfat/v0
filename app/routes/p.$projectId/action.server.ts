import { z } from "zod";
import { zfd } from "zod-form-data";
import { ModelPreview } from "~/.server/models";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { requireTruthy, standard } from "~/lib/utils.server";

import { ActionIntent } from "./types";

export const action = new ResourceBuilder()
  .register({
    method: "POST",
    intent: ActionIntent.UPDATE_THUMBNAIL,
    validate: {
      params: z.object({ projectId: z.string() }),
      body: z.object({ version: z.number(), image: z.string() }),
    },
    handler: async ({
      params: { projectId: project_id },
      body: { version, image: thumbnail_src },
    }) => {
      console.log("uploaded", version);
      try {
        await ModelPreview.updateThumbnail({
          project_id,
          version,
          thumbnail_src,
        });
      } catch (error) {
        return standard(false, "failed update preview thumbnail");
      }

      return standard(true, "updated image preview");
    },
  })
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
