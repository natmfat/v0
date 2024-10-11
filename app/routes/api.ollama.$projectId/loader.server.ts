import { z } from "zod";
import { ModelPreview } from "~/.server/models";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { notFound, requireTruthy } from "~/lib/utils.server";

import { streamResponse } from "./lib/streamResponse";
import systemPromptAdjust from "./lib/systemPromptAdjust.txt?raw";
import systemPromptDefault from "./lib/systemPromptDefault.txt?raw";

export const loader = new ResourceBuilder()
  .register({
    method: "GET",
    validate: { params: z.object({ projectId: z.string() }) },
    handler: async ({ params: { projectId: project_id } }) => {
      requireTruthy(project_id, notFound());
      const preview = await ModelPreview.findLatestVersion({ project_id });
      requireTruthy(preview, notFound());

      const onFinish = (code: string) => {
        ModelPreview.updateCode({
          project_id,
          version: preview.version,
          code,
        });
      };

      if (preview.code.length === 0) {
        return streamResponse({
          systemPrompt: systemPromptDefault,
          userPrompt: preview.prompt,
          onFinish,
        });
      }

      return streamResponse({
        systemPrompt: systemPromptAdjust,
        userPrompt: `${preview.prompt}\nExisting code:${preview.code}`,
        onFinish,
      });
    },
  })
  .create();
