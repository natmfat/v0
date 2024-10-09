import { LoaderFunctionArgs } from "@remix-run/node";
import { convertToCoreMessages, streamText } from "ai";
import { ollama } from "ollama-ai-provider";
import { emitter } from "~/.server/emitter";
import { ModelPreview, ModelProject } from "~/.server/models";
import { notFound, requireTruthy } from "~/lib/utils.server";

import { eventStream } from "./lib/eventStream";
import systemPrompt from "./lib/systemPrompt.md?raw";

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
          content: "say hello.",
        },
        {
          role: "user",
          content: "how are you?",
        },
      ]),
      onFinish: async ({ text }) => {
        // await ModelPreview.updateCode({ id: preview.id, code: text });
        send({ event: "complete", data: text });
      },
    });

    // https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text
    let textAccumulator: string[] = [];
    for await (const textPart of textStream) {
      textAccumulator.push(textPart);
      if (textAccumulator.length > 5) {
        send({ event: "message", data: textAccumulator.join("") });
        textAccumulator = [];
      }
    }

    send({ event: "message", data: textAccumulator.join("") });
  });
}
