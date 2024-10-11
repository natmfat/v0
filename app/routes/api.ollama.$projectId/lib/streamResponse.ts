import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";

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
      model: ollama("llama3.2:latest"),
      system: systemPrompt,
      prompt: `User: ${userPrompt}`,
      onFinish: ({ text }) => onFinish(text),
    })
  ).toDataStreamResponse();
}
