import puppeteer from "puppeteer";
import { z } from "zod";
import { ModelPreview } from "~/.server/models";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { standard } from "~/lib/utils.server";

import { createRoute as createPreviewRoute } from "./api.iframe.$projectId.$version[.html]";

export function createRoute(projectId: string, version: number = 0) {
  return `/api/screenshot/${projectId}/${version}`;
}

export const loader = new ResourceBuilder()
  .register({
    method: "GET",
    validate: {
      params: z.object({
        projectId: z.string(),
        version: z.number({ coerce: true }),
      }),
    },
    handler: async ({
      params: { projectId: project_id, version },
      context: { request },
    }) => {
      // @todo validate project id & version (and don't launch puppeteer if we already created one)

      const browser = await puppeteer.launch({
        headless: true,
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 720,
        deviceScaleFactor: 0.25,
      });
      await page.goto(
        new URL(
          createPreviewRoute(project_id, version),
          request.url,
        ).toString(),
        {
          waitUntil: "networkidle0",
        },
      );
      const data = await page.screenshot({ encoding: "base64" });
      await browser.close();

      // save screenshot
      const thumbnail_src = `data:image/png;base64,${data}`;
      await ModelPreview.updateThumbnail({
        project_id,
        version,
        thumbnail_src,
      });

      return standard(true, "created screenshot", {
        thumbnail_src,
      });
    },
  })
  .create();

// https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];
