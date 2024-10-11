import { useContext, useEffect, useRef, useState } from "react";
import { CodeBlock, solarizedLight } from "react-code-blocks";
import { Button } from "tanukui/components/Button.js";
import { Surface } from "tanukui/components/Surface.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "tanukui/components/Tabs.js";
import { Text } from "tanukui/components/Text.js";
import { ToastContext } from "tanukui/components/Toast.js";
import { View } from "tanukui/components/View.js";
import { RiClipboardIcon } from "tanukui/icons/RiClipboardIcon.js";
import { RiReactjsIcon } from "tanukui/icons/RiReactjsIcon.js";
import { cn } from "tanukui/lib/cn.js";

import { Layout, useProjectStore } from "../../hooks/useProjectStore";
import { copyToClipboard } from "../../lib/copyToClipboard";

interface PreviewFrameProps {
  /** AI generated React component */
  code: string;
}

export function PreviewFrame({ code }: PreviewFrameProps) {
  const layout = useProjectStore((store) => store.layout);
  const ref = useRef<HTMLDivElement>(null);

  const showCode = useProjectStore((store) => store.showCode);

  const { addToast } = useContext(ToastContext);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
    setHeight(ref.current?.offsetHeight || 0);
  }, [layout, showCode]);

  return (
    <View className="h-full w-full flex-row gap-2">
      <View className="w-full h-full rounded-default overflow-hidden flex-1 border items-center px-4">
        <View
          ref={ref}
          className={cn(
            "relative h-full border-l border-r border-red-default",
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
      </View>
      {showCode ? (
        <View className="w-full h-full overflow-hidden flex-1">
          <Tabs
            className="flex flex-col gap-2 items-stretch h-full"
            defaultValue="default"
          >
            <TabsList className="flex-shrink-0 flex-grow-0">
              <TabsTrigger value="default">
                <RiReactjsIcon />
                <Text>main.jsx</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="default" className="h-full flex-1">
              <View className="rounded-default overflow-hidden h-full flex-1 max-w-full font-mono bg-[#fff4e4] [&>span]:h-full relative border">
                <Button
                  size={12}
                  className="absolute top-2 right-2"
                  color="transparent"
                  onClick={() => {
                    addToast({
                      type: "success",
                      message: "Copied code to clipboard.",
                    });
                    copyToClipboard(code);
                  }}
                >
                  <RiClipboardIcon />
                  Copy
                </Button>
                <CodeBlock
                  text={code}
                  language="jsx"
                  showLineNumbers={false}
                  theme={solarizedLight}
                />
              </View>
            </TabsContent>
          </Tabs>
        </View>
      ) : null}
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
