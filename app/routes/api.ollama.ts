import { convertToCoreMessages, streamText } from "ai";
import { ollama } from "ollama-ai-provider";
import { z } from "zod";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import systemPrompt from "~/lib/systemPrompt.md?raw";

// @todo create project ({ prompt, initalized (default to false, turn to true later) })
// @todo store user messages associated with project
export const ROUTE = "/api/ollama";
export enum Intent {
  GENERATE = "generate",
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
    intent: Intent.GENERATE,
    validate: {
      body: z.object({
        messages: z.array(
          z.object({
            role: z.union([
              z.literal("system"),
              z.literal("user"),
              z.literal("assistant"),
            ]),
            content: z.string(),
          }),
        ),
      }),
    },
    handler: async ({ body: { messages } }) => {
      const result = await streamText({
        model: ollama("llama3.2:latest", {}),
        messages: convertToCoreMessages([
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ]),
      });

      return result.toDataStreamResponse();
    },
  })
  .create();
