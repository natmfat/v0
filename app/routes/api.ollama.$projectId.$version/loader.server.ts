import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";
import { RemixLoader } from "remix-endpoint";
import { z } from "zod";
import { shitgen } from "~/.server/database/client";
import { notFound, requireTruthy, standard } from "~/lib/utils.server";

import { processLines } from "./lib/processLines";
import systemPromptAdjust from "./lib/prompt/systemAdjust.txt?raw";
import systemPromptDefault from "./lib/prompt/systemDefault.txt?raw";

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
        where: { project_id, version },
      });
      requireTruthy(preview, notFound());

      function onFinish(code: string) {
        shitgen.preview.update({
          data: { code },
          where: {
            project_id,
            version,
          },
        });
      }

      if (preview && preview.code?.length !== 0) {
        // this shouldn't be possible btw
        return standard(
          false,
          "you've already created a code preview for the latest version!",
        );
      }

      // if code is empty and this is v0
      // we should use the default system prompt
      if (version === 0) {
        return streamResponse({
          systemPrompt: systemPromptDefault,
          userPrompt: `User: ${preview.prompt}`,
          onFinish,
        });
      }

      // get all previous prompts & code (remove last, that's the current prompt)
      // @todo could be more efficient
      const previews = await shitgen.preview.findMany({
        select: ["code", "prompt"],
        where: { project_id },
        orderBy: {
          version: "DESC",
        },
      });
      previews.pop();

      const prevPrompts = previews.map(
        (preview, i) => `${i + 1}. ${preview.prompt}`,
      );

      return streamResponse({
        systemPrompt: systemPromptAdjust,
        userPrompt: `Past user requests:
${prevPrompts.join("\n")}
Current user request: ${preview.prompt}
Current code:
${previews[previews.length - 1].code}`,
        onFinish,
      });
    },
  })
  .create();

type StreamResponseArgs = {
  userPrompt: string;
  systemPrompt: string;
  onFinish: (text: string) => void;
};

/**
 * Generate text & stream to client
 * @returns A response
 */
export async function streamResponse({
  userPrompt,
  systemPrompt,
  onFinish,
}: StreamResponseArgs) {
  return (
    await streamText({
      model: ollama("qwen2.5-coder:1.5b"),
      system: systemPrompt,
      prompt: userPrompt,
      onFinish: ({ text }) => {
        onFinish(processLines(text));
      },
    })
  ).toDataStreamResponse();
}
