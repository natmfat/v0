import { PreviewData } from "database/client";
import invariant from "invariant";
import { useCallback, useEffect, useRef } from "react";
import { StandardResponse } from "~/lib/utils.server";
import { createRoute } from "~/routes/api.screenshot.$projectId.$version";

import { useProjectStore } from "./useProjectStore";

export function useRequestScreenshot({
  code,
  version,
  thumbnail_src,
}: Pick<PreviewData, "version" | "thumbnail_src" | "code">) {
  const projectId = useProjectStore((store) => store.projectId);

  const isLoadingRef = useRef(false);
  const isLoading = () => isLoadingRef.current;

  const updatePreview = useProjectStore((store) => store.updatePreview);

  const requestScreenshot = useCallback(async () => {
    if (isLoading()) {
      return;
    }

    isLoadingRef.current = true;
    invariant(typeof version === "number", "expected version");
    const response = await fetch(createRoute(projectId, version));
    const { success, data } = (await response.json()) as StandardResponse<{
      thumbnail_src: string;
    }>;
    isLoadingRef.current = false;
    if (success && data?.thumbnail_src) {
      updatePreview(version, { thumbnail_src: data.thumbnail_src });
    }
    // @todo timeout & just return an error?
  }, [version, updatePreview, projectId]);

  // request screenshot if thumbnail is blank & on version change
  useEffect(() => {
    // technically thumbnail must exist (db schema, but I should probably change this - same with code)
    // @todo better to have null than constantly doing length checks
    if (
      (!thumbnail_src || thumbnail_src.length === 0) &&
      code &&
      code.length > 0
    ) {
      requestScreenshot();
    }
  }, [thumbnail_src, code, requestScreenshot]);

  return {
    isLoading,
    requestScreenshot,
  };
}

// @todo take a screenshot, send to server, and then revalidate
// similar hook to useFetchStream (useScreenshot?)
