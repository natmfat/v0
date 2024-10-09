type FetchStreamArgs = {
  /* API route to use  */
  api: string;

  /* Callback called on each chunk (it's already formatted) */
  onChunk: (chunk: string) => void;

  /* Callback when all chunks are loaded  */
  onComplete: (chunks: string[]) => void;
};

// on error?

export function useFetchStream({ api, onChunk, onComplete }: FetchStreamArgs) {
  return {
    fetch: async (body: BodyInit) => {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response || !response.ok) {
        onComplete([]);
        return;
      }

      onComplete(
        await streamResponse({
          response,
          onChunk,
        }),
      );
    },
  };
}

async function streamResponse({
  response,
  onChunk,
}: {
  response: Response;
  onChunk: FetchStreamArgs["onChunk"];
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
