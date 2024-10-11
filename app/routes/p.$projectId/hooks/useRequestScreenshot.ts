import { useCallback, useEffect, useRef } from "react";
import { Preview } from "~/.server/models/ModelPreview";
import { StandardResponse } from "~/lib/utils.server";

import { createRoute } from "..";
import { ActionIntent } from "../types";
import { useProjectStore } from "./useProjectStore";

export function useRequestScreenshot({
  version,
  thumbnail_src,
}: Pick<Preview, "version" | "thumbnail_src">) {
  const projectId = useProjectStore((store) => store.projectId);

  const isLoadingRef = useRef(false);
  const isLoading = () => isLoadingRef.current;

  const updatePreview = useProjectStore((store) => store.updatePreview);

  // const { iframeRef, uploadScreenshot } = useScreenshotFrame({ version });

  const requestScreenshot = useCallback(async () => {
    if (!isLoading()) {
      return;
    }

    isLoadingRef.current = true;
    const response = await fetch(createRoute(projectId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: ActionIntent.UPDATE_THUMBNAIL,
        version,
      }),
    });
    isLoadingRef.current = false;
    const { success, data } = (await response.json()) as StandardResponse<{
      thumbnail_src: string;
    }>;
    if (success && data?.thumbnail_src) {
      updatePreview(version, { thumbnail_src: data.thumbnail_src });
    }
    // @todo timeout & just return an error?
  }, [version, updatePreview, projectId]);

  // request screenshot if thumbnail is blank & on version change
  useEffect(() => {
    // technically thumbnail must exist (db schema, but I should probably change this - same with code)
    // @todo better to have null than constantly doing length checks
    if (!thumbnail_src || thumbnail_src.length === 0) {
      requestScreenshot();
    }
  }, [thumbnail_src]);

  return {
    isLoading,
    requestScreenshot,
  };
}

// @todo take a screenshot, send to server, and then revalidate
// similar hook to useFetchStream (useScreenshot?)
