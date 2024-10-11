import { useCallback, useEffect, useRef, useState } from "react";
import { Preview } from "~/.server/models/ModelPreview";
import { createRoute } from "~/routes/api.ollama.$projectId";
import { processLines } from "~/routes/api.ollama.$projectId/lib/processLines";

import { useProjectStore } from "./useProjectStore";

// @todo body is possible to type, just get resource zod validator type

export function useRequestStream({
  version,
  code,
}: Pick<Preview, "version" | "code">) {
  const projectId = useProjectStore((store) => store.projectId);
  const updatePreview = useProjectStore((store) => store.updatePreview);
  const setGlobalStreaming = useProjectStore((store) => store.setStreaming);

  // internal use to prevent streaming more if already called
  // state changes are queued, but refs are instant
  const isStreamingRef = useRef(false);
  const isStreaming = () => isStreamingRef.current;

  const stop = useRef(false);

  const setStreaming = useCallback(
    (nextStreaming: boolean) => {
      isStreamingRef.current = nextStreaming;
      setGlobalStreaming(nextStreaming);
    },
    [setGlobalStreaming],
  );

  const requestStream = useCallback(async () => {
    if (isStreaming() || stop.current) {
      return;
    }

    setStreaming(true);
    const response = await fetch(createRoute(projectId));

    if (!response.ok) {
      stop.current = true;
      setStreaming(false);
      return;
    }

    const output = (
      await streamResponse({
        response,
      })
    ).join("");
    updatePreview(version, { code: processLines(output) });
    setStreaming(false);
  }, [projectId, version, updatePreview]);

  useEffect(() => {
    stop.current = false;
  }, [version]);

  useEffect(() => {
    if (!code || code.length === 0) {
      requestStream();
    }
  }, [code, requestStream]);

  return {
    isStreaming,
    fetch: requestStream,
  };
}

async function streamResponse({
  response,
}: {
  response: Response;
}): Promise<string[]> {
  if (!response.ok || !response.body) {
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
            chunks.push(chunk);
          }
        }
      }
    }
  }

  return chunks;
}
