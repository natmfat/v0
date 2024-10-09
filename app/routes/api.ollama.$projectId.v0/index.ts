import { LoaderFunctionArgs } from "@remix-run/node";
import { convertToCoreMessages, streamText } from "ai";
import { ollama } from "ollama-ai-provider";
import { ModelPreview, ModelProject } from "~/.server/models";
import { notFound, requireTruthy } from "~/lib/utils.server";

import { eventStream } from "./lib/eventStream";
import systemPrompt from "./lib/systemPrompt.txt?raw";

export function createRoute(projectId: string) {
  return `/api/ollama/${projectId}/v0`;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const projectId = params.projectId;
  requireTruthy(projectId, notFound());
  const prompt = await ModelProject.findPrompt({ id: projectId });
  requireTruthy(prompt, notFound());

  return eventStream(request.signal, async (send) => {
    const { textStream } = await streamText({
      model: ollama("llama3.2:latest"),
      messages: convertToCoreMessages([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `User: ${prompt}`,
        },
      ]),
      onFinish: async ({ text }) => {
        // @todo renable this after dev
        // await ModelPreview.updateCode({ id: preview.id, code: text });
        send({ event: "complete", data: text });
      },
    });

    // stream in bigger phrases rather than single words,
    // I think less browser communication w/ bigger packets is probably better?
    let acc: string[] = [];
    for await (const textPart of textStream) {
      acc.push(textPart);
      if (acc.length > 10) {
        send({ event: "message", data: acc.join("") });
        acc = [];
      }
    }

    send({ event: "message", data: acc.join("") });
  });
}
