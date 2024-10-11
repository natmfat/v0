import { useRevalidator } from "@remix-run/react";
import html2canvas from "html2canvas";
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

  const revalidator = useRevalidator();

  const uploadScreenshot = useCallback(async () => {
    if (!iframeRef.current || isLoading()) {
      return;
    }

    const screen = iframeRef.current.contentDocument?.body;
    if (!screen) {
      return;
    }

    isLoadingRef.current = true;
    const canvas = await html2canvas(screen, { scale: 0.5 });
    const image = canvas.toDataURL("image/png");

    const response = await fetch(createRoute(projectId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: ActionIntent.UPDATE_THUMBNAIL,
        version,
        image,
      }),
    });

    if (response.ok) {
      revalidator.revalidate();
    }
  }, [revalidator, projectId]);

  return {
    iframeRef,
    isLoading,
    uploadScreenshot,
  };
}

// @todo take a screenshot, send to server, and then revalidate
// similar hook to useFetchStream (useScreenshot?)
