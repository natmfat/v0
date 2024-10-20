import { Surface } from "natmfat/components/Surface";
import { Tabs, TabsList, TabsTrigger } from "natmfat/components/Tabs";
import { Text } from "natmfat/components/Text";
import { View } from "natmfat/components/View";
import { RiHtml5Icon } from "natmfat/icons/RiHtml5Icon";
import { RiReactjsIcon } from "natmfat/icons/RiReactjsIcon";
import { cn } from "natmfat/lib/cn";
import { useEffect, useRef, useState } from "react";
import { type Preview } from "~/.server/models/ModelPreview";

import { Layout, useProjectStore } from "../../hooks/useProjectStore";
import { FAKE_HTML, generateCode } from "../../lib/generateCode";
import { TabsContentCode } from "./TabsContentCode";

export function PreviewFrame({ code }: Pick<Preview, "code">) {
  const layout = useProjectStore((store) => store.layout);
  const containerRef = useRef<HTMLDivElement>(null);

  const showCode = useProjectStore((store) => store.showCode);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(containerRef.current?.offsetWidth || 0);
    setHeight(containerRef.current?.offsetHeight || 0);
  }, [layout, showCode]);

  return (
    <View className="h-full w-full max-h-full overflow-hidden flex-1 flex-row gap-2">
      <View className="w-full h-full rounded-default overflow-hidden flex-1 border items-center px-4">
        <View
          ref={containerRef}
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
            <TabsContentCode value="html" language="html" code={FAKE_HTML} />
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
