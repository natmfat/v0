import { useContext, useEffect, useRef, useState } from "react";
import { CodeBlock, solarizedLight } from "react-code-blocks";
import { Button } from "tanukui/components/Button.js";
import { Interactive } from "tanukui/components/Interactive.js";
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
import { RiHtml5Icon } from "tanukui/icons/RiHtml5Icon.js";
import { RiReactjsIcon } from "tanukui/icons/RiReactjsIcon.js";
import { cn } from "tanukui/lib/cn.js";

import { Layout, useProjectStore } from "../../hooks/useProjectStore";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { generateCode } from "../../lib/generateCode";
import { TabsContentCode } from "./TabsContentCode";

interface PreviewFrameProps {
  /** AI generated React component */
  code: string;
}

export function PreviewFrame({ code }: PreviewFrameProps) {
  const layout = useProjectStore((store) => store.layout);
  const ref = useRef<HTMLDivElement>(null);

  const showCode = useProjectStore((store) => store.showCode);

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
          className={cn("h-full flex-row relative", layoutToWidth(layout))}
        >
          <iframe
            title="Preview Code"
            srcDoc={generateCode(code)}
            className="h-full w-full outline-none border-x"
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
            defaultValue="entry"
          >
            <TabsList className="flex-shrink-0 flex-grow-0">
              <TabsTrigger value="entry">
                <RiReactjsIcon />
                <Text>main.jsx</Text>
              </TabsTrigger>
              <TabsTrigger value="html">
                <RiHtml5Icon />
                <Text>index.html</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContentCode value="entry" code={code} />
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

// data-plugins="transform-es2015-modules-umd"
