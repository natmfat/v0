import invariant from "invariant";
import { useCallback, useEffect, useRef } from "react";
import { PreviewData } from "~/.server/database/client";
import { createRoute } from "~/routes/api.ollama.$projectId.$version";
import { processLines } from "~/routes/api.ollama.$projectId.$version/lib/processLines";

import { useProjectStore } from "./useProjectStore";

// @todo body is possible to type, just get resource zod validator type

export function useRequestStream({
  version,
  code,
}: Pick<PreviewData, "version" | "code">) {
  const projectId = useProjectStore((store) => store.projectId);
  const updatePreview = useProjectStore((store) => store.updatePreview);
  const setGlobalStreaming = useProjectStore((store) => store.setStreaming);

  // internal use to prevent streaming more if already called
  // state changes are queued, but refs are instant
  const isStreamingRef = useRef(false);
  const isStreaming = () => isStreamingRef.current;
  const noCode = () => !code || code.length === 0;

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
    const response = await fetch(createRoute(projectId, version));
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
    if (noCode()) {
      updatePreview(version, { code: processLines(output) });
    }
    setStreaming(false);
  }, [projectId, version, updatePreview, noCode, setStreaming]);

  useEffect(() => {
    stop.current = false;
  }, [version]);

  useEffect(() => {
    if (noCode()) {
      requestStream();
    }
  }, [code, version, noCode, requestStream]);

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
