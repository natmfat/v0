import { Button } from "tanukui/components/Button.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Separator } from "tanukui/components/Separator.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { RiComputerIcon } from "tanukui/icons/RiComputerIcon.js";
import { RiFullscreenIcon } from "tanukui/icons/RiFullscreenIcon.js";
import { RiLayoutIcon } from "tanukui/icons/RiLayoutIcon.js";
import { RiPaintIcon } from "tanukui/icons/RiPaintIcon.js";
import { RiSmartphoneIcon } from "tanukui/icons/RiSmartphoneIcon.js";
import { RiTabletIcon } from "tanukui/icons/RiTabletIcon.js";

import { useProjectStore } from "../../hooks/useProjectStore";
import { useEffect } from "react";
import { useFetchStream } from "../../hooks/useFetchStream";
import { createRoute } from "~/routes/api.ollama.$projectId";
import { findPreview } from "../../lib/projectStoreUtils";
import invariant from "invariant";
import { RiLoader2Icon } from "tanukui/icons/RiLoader2Icon.js";
import { generateCode } from "../../lib/generateCode";

export function PanelPreview() {
  const projectId = useProjectStore((store) => store.projectId);
  const streaming = useProjectStore((store) => store.streaming);

  const setPreviewCode = useProjectStore((store) => store.setPreviewCode);
  const preview = useProjectStore((store) =>
    findPreview(store.previews, store.selectedVersion)
  );

  invariant(preview, "expected a preview");

  const fetcher = useFetchStream({
    api: createRoute(projectId),
    onFinish: (code) => {
      setPreviewCode(preview.version, code);
    },
  });

  // request generation if preview is empty
  useEffect(() => {
    console.log(preview);
    if (preview.code.length === 0) {
      fetcher.fetch();
    }
  }, [preview]);

  return (
    <Surface
      elevated
      className="p-2 gap-2 h-full flex-1 w-full rounded-default overflow-hidden"
    >
      <View className="flex-row justify-between items-center flex-shrink-0 flex-grow-0 gap-2">
        <Surface
          className="px-3 py-1 select-none flex-shrink max-w-full overflow-hidden h-fit rounded-full cursor-pointer"
          elevated
        >
          <Text className="w-full flex-1">{preview.prompt}</Text>
        </Surface>

        <View className="flex-row gap-2 w-fit">
          <Surface className="p-1 gap-1.5 rounded-default flex-row" elevated>
            <IconButton alt="Desktop width">
              <RiComputerIcon />
            </IconButton>
            <IconButton alt="Tablet width">
              <RiTabletIcon />
            </IconButton>
            <IconButton alt="Smartphone width">
              <RiSmartphoneIcon />
            </IconButton>
            <Separator orientation="vertical" />
            <IconButton alt="Fullscreen">
              <RiFullscreenIcon />
            </IconButton>
          </Surface>

          <Button size={16} color="transparent" variant="outline">
            <RiPaintIcon />
            Theme
          </Button>
          <Button size={16} color="transparent">
            <RiLayoutIcon />
            Canvas
          </Button>
        </View>
      </View>

      <View className="h-full flex-1 border rounded-default overflow-hidden">
        {streaming || preview.code.length === 0
          ? (
            <View className="h-full w-full grid place-items-center">
              <View className="gap-1 flex-row items-center">
                <RiLoader2Icon className="animate-[spin_2s_linear_infinite]" />
                <Text size="small" color="dimmer">Building your ideas</Text>
              </View>
            </View>
          )
          : (
            <iframe
              title="Preview Code"
              srcDoc={generateCode(preview.code)}
              className="border-none outline-none h-full w-full"
            />
          )}
      </View>
    </Surface>
  );
}

// @todo create 3 variants, like v0
