import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";

import systemPrompt from "./systemPrompt.txt?raw";

/**
 * Generate text & stream to client
 * @param prompt User prompt, like "create me a color palette app"
 * @param onFinish Process generated code in some way
 * @returns A response
 */
export async function streamResponse(
  prompt: string,
  onFinish: (text: string) => void,
) {
  return (await streamText({
    model: ollama("llama3.2:latest"),
    system: systemPrompt,
    prompt: `User: ${prompt}`,
    onFinish: ({ text }) => onFinish(text),
  })).toDataStreamResponse();
}
