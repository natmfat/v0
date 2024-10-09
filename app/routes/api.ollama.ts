import { convertToCoreMessages, streamText } from "ai";
import { ollama } from "ollama-ai-provider";
import { z } from "zod";
import { ResourceBuilder } from "~/lib/ResourceBuilder";

// import systemPrompt from "~/lib/systemPrompt.md?raw";
//
const systemPrompt = "";

// @todo create project ({ prompt, initalized (default to false, turn to true later) })
// @todo store user messages associated with project
export const ROUTE = "/api/ollama";
export enum Intent {
  GENERATE_V0 = "generate_v0",
}

// potential pipeline:
// 1. design a layout for mobile, keep it short and add comments where functional components should be
// 2. transform layout into functional react components
// 3. refactor codebase with new tanukui components
// 4. add responsive styles using tailwind

// add a tool to fetch documentation
// add tool to refactor existing code?

export const action = new ResourceBuilder()
  .register({
    method: "POST",
    intent: Intent.GENERATE_V0,
    validate: {
      body: z.object({
        project_id: z.string(),
        prompt: z.string(),
      }),
    },
    handler: async ({ body: { project_id, prompt } }) => {
      const result = await streamText({
        model: ollama("llama3.2:latest"),
        messages: convertToCoreMessages([
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ]),
        onChunk: (chunk) => {},
        onFinish: () => {},
      });

      return result.toDataStreamResponse();
    },
  })
  .create();
