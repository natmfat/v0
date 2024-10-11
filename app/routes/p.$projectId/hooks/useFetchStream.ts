import { useRef, useState } from "react";
import { useProjectStore } from "./useProjectStore";

type FetchStreamArgs = {
  /* API route to use  */
  api: string;

  /* Callback called on each chunk (it's already formatted) */
  onChunk?: (chunk: string) => void;

  /* Callback when all chunks are loaded  */
  onFinish?: (code: string) => void;
  // on error?
};

const noop = () => {};

// @todo body is possible to type, just get resource zod validator type

export function useFetchStream(
  {
    api,
    onChunk = noop,
    onFinish = noop,
  }: FetchStreamArgs,
) {
  // global streaming state
  const setGlobalStreaming = useProjectStore((store) => store.setStreaming);

  // internal use to prevent streaming more if already called
  // state changes are queued, but refs are instant
  const isStreamingRef = useRef(false);
  const isStreaming = () => isStreamingRef.current;

  const setStreaming = (nextStreaming: boolean) => {
    isStreamingRef.current = nextStreaming;
    setGlobalStreaming(nextStreaming);
  };

  return {
    isStreaming,
    fetch: async () => {
      if (isStreaming()) {
        return;
      }

      setStreaming(true);
      const response = await fetch(api, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // response failed, exit
      if (!response || !response.ok) {
        onFinish("");
        setStreaming(false);
        return;
      }

      // otherwise read stream
      const output = (await streamResponse({
        response,
        onChunk,
      })).join("");
      onFinish(output);
      setStreaming(false);
    },
  };
}

async function streamResponse({
  response,
  onChunk,
}: {
  response: Response;
  onChunk: NonNullable<FetchStreamArgs["onChunk"]>;
}): Promise<string[]> {
  if (!response.body) {
    return [];
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  const chunks: string[] = [];
  let done = false;
  while (!done) {
    const result = await reader.read();
    if (result.done) {
      done = true;
    } else {
      const lines = result.value.split("\n");
      for (const line of lines) {
        const prefix = line.charAt(0);
        switch (prefix) {
          case "0": {
            // format chunk by removing trailing & ending quotes
            // also replace escaped chars with their actual chars
            const chunk = line
              .substring(3, line.length - 1)
              .trimEnd()
              .replaceAll(/\\n/g, "\n")
              .replaceAll(/\\"/g, `"`);
            onChunk(chunk);
            chunks.push(chunk);
          }
        }
      }
    }
  }

  return chunks;
}
