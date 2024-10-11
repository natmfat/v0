import { useEffect, useRef, useState } from "react";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";

import { Layout, useProjectStore } from "../../hooks/useProjectStore";

interface PreviewFrameProps {
  /** AI generated React component */
  code: string;
}

export function PreviewFrame({ code }: PreviewFrameProps) {
  const layout = useProjectStore((store) => store.layout);
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
    setHeight(ref.current?.offsetHeight || 0);
  }, [layout]);

  return (
    <View
      ref={ref}
      className={cn(
        "relative h-full w-full border rounded-default overflow-hidden",
        layoutToWidth(layout),
      )}
    >
      <iframe
        title="Preview Code"
        srcDoc={generateCode(code)}
        className="h-full w-full outline-none"
        sandbox="allow-scripts allow-same-origin"
      />
      <Surface
        background="highest"
        className="absolute px-2 py-1 rounded-lg bottom-2 right-2 select-none"
      >
        <Text size="small">
          {width} x {height}
        </Text>
      </Surface>
    </View>
  );
}

function layoutToWidth(layout: Layout): string {
  switch (layout) {
    case Layout.TABLET:
      return "max-w-3xl w-full";

    case Layout.MOBILE:
      return "max-w-xs w-full";

    default:
    case Layout.DESKTOP:
      return "w-full";
  }
}

export function generateCode(code: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tanukui Themes</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
      />
      <script src="https://cdn.tailwindcss.com"></script>

      <style>
        #root {
          margin: 0 auto;
          width: fit-content;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
      <script type="text/babel">
        Object.assign(window, React);

        ${code}

        ReactDOM.render(<App />, document.querySelector("#root"));
      </script>
    </body>
  </html>`;
}

// data-plugins="transform-es2015-modules-umd"
