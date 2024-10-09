import { Events } from "~/.server/emitter";

interface SendFunctionArgs {
  /**
   * @default "message"
   */
  event?: keyof Events;
  data: string;
}

type SendFunction = (args: SendFunctionArgs) => void;
type CleanupFunction = () => void;
type AbortFunction = () => void;
type InitFunction = (
  send: SendFunction,
  abort: AbortFunction,
) => Promise<CleanupFunction | void>;

/**
 * A response helper to use Server Sent Events server-side
 * @param signal The AbortSignal used to close the stream
 * @param init The function that will be called to initialize the stream, here you can subscribe to your events
 * @returns A Response object that can be returned from a loader
 */
export function eventStream(
  signal: AbortSignal,
  init: InitFunction,
  options: ResponseInit = {},
) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      function send({ event = "message", data }: SendFunctionArgs) {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      const cleanup = await init(send, close);
      let closed = false;
      function close() {
        if (closed) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        closed = true;
        signal.removeEventListener("abort", close);
        controller.close();
      }
      signal.addEventListener("abort", close);
      if (signal.aborted) {
        return close();
      }
    },
  });

  const headers = new Headers(options.headers);
  if (headers.has("Content-Type")) {
    console.warn("Overriding Content-Type header to `text/event-stream`");
  }
  if (headers.has("Cache-Control")) {
    console.warn("Overriding Cache-Control header to `no-cache`");
  }
  if (headers.has("Connection")) {
    console.warn("Overriding Connection header to `keep-alive`");
  }
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");

  return new Response(stream, { headers });
}
