import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { Preview } from "~/.server/models/ModelPreview";
import { createRoute } from "~/routes/api.ollama.$projectId.v0";

import { useProjectStore } from "./useProjectStore";

export function usePreviewStream(): Preview & { loading?: boolean } {
  const projectId = useProjectStore((store) => store.projectId);
  const preview = useProjectStore(
    (store) =>
      store.previews.find(
        (preview) => preview.version === store.selectedVersion,
      )!,
  );

  const route = createRoute(projectId);
  const enabled = !preview.code; // stream from v0 if preview doesn't have any code

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(enabled);

  const chunk = useEventSource(route, { event: "message", enabled });
  const complete = useEventSource(route, { event: "complete", enabled });

  useEffect(() => {
    // https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-event-source.ts
    if (chunk && chunk !== "UNKNOWN_EVENT_DATA") {
      setCode((prevCode) => prevCode + chunk);
    }
  }, [chunk]);

  useEffect(() => {
    if (complete) {
      console.log(complete);
      setLoading(false);
    }
  }, [complete]);

  return { ...preview, loading, code };
}
