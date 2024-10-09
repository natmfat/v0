import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { Preview } from "~/.server/models/ModelPreview";
import { createRoute } from "~/routes/api.ollama.$projectId.v0";

import { useProjectStore } from "./useProjectStore";

export function usePreviewStream(): Preview {
  const projectId = useProjectStore((store) => store.projectId);
  const preview = useProjectStore(
    (store) =>
      store.previews.find(
        (preview) => preview.version === store.selectedVersion,
      )!,
  );
  const [code, setCode] = useState("");

  // stream from v0 if preview doesn't have any code
  const enabled = !preview.code;
  const route = createRoute(projectId);
  const chunk = useEventSource(route, { event: "message", enabled });
  const complete = useEventSource(route, { event: "complete", enabled });

  useEffect(() => {
    if (chunk) {
      setCode((prevCode) => prevCode + chunk);
    }
  }, [chunk]);

  useEffect(() => {
    if (complete) {
      setCode(complete);
    }
  }, [complete]);

  return { ...preview, code };
}
