import html2canvas from "html2canvas";
import invariant from "invariant";
import { useCallback, useRef } from "react";
import { Preview } from "~/.server/models/ModelPreview";

import { createRoute } from "..";
import { ActionIntent } from "../types";
import { useProjectStore } from "./useProjectStore";

export function useScreenshotFrame({ version }: Pick<Preview, "version">) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const projectId = useProjectStore((store) => store.projectId);

  const isLoadingRef = useRef(false);
  const isLoading = () => isLoadingRef.current;

  const updatePreview = useProjectStore((store) => store.updatePreview);

  const uploadScreenshot = useCallback(async () => {
    if (!iframeRef.current || isLoading()) {
      return;
    }

    const screen = iframeRef.current.contentDocument?.body!;
    invariant(screen, "expected iframe screen");

    isLoadingRef.current = true;
    const canvas = await html2canvas(screen, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      scale: 0.2,
    });
    const image = canvas.toDataURL("image/jpeg", 1.0);
    await fetch(createRoute(projectId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: ActionIntent.UPDATE_THUMBNAIL,
        version,
        image,
      }),
    });
    isLoadingRef.current = false;
    updatePreview(version, { thumbnail_src: image });

    // @todo timeout & just return an error?
  }, [version, updatePreview, projectId]);

  return {
    iframeRef,
    isLoading,
    uploadScreenshot,
  };
}

// @todo take a screenshot, send to server, and then revalidate
// similar hook to useFetchStream (useScreenshot?)
