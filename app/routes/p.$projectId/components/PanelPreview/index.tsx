import invariant from "invariant";
import { useContext, useEffect } from "react";
import { Button } from "tanukui/components/Button.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { ToastContext } from "tanukui/components/Toast.js";
import { View } from "tanukui/components/View.js";
import { RiComputerIcon } from "tanukui/icons/RiComputerIcon.js";
import { RiLayoutIcon } from "tanukui/icons/RiLayoutIcon.js";
import { RiLoader2Icon } from "tanukui/icons/RiLoader2Icon.js";
import { RiPaintIcon } from "tanukui/icons/RiPaintIcon.js";
import { RiSmartphoneIcon } from "tanukui/icons/RiSmartphoneIcon.js";
import { RiTabletIcon } from "tanukui/icons/RiTabletIcon.js";
import { createRoute } from "~/routes/api.ollama.$projectId";

import { useFetchStream } from "../../hooks/useFetchStream";
import { Layout, useProjectStore } from "../../hooks/useProjectStore";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { findPreview } from "../../lib/projectStoreUtils";
import { PreviewFrame } from "./PreviewFrame";

export function PanelPreview() {
  const projectId = useProjectStore((store) => store.projectId);
  const streaming = useProjectStore((store) => store.streaming);

  const setPreviewCode = useProjectStore((store) => store.setPreviewCode);
  const preview = useProjectStore((store) =>
    findPreview(store.previews, store.selectedVersion),
  );

  const setLayout = useProjectStore((store) => store.setLayout);

  const { addToast } = useContext(ToastContext);

  invariant(preview, "expected a preview");

  const fetcher = useFetchStream({
    api: createRoute(projectId),
    onFinish: (code) => {
      setPreviewCode(preview.version, code);
    },
  });

  // request generation if preview is empty
  useEffect(() => {
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
          onClick={() => {
            copyToClipboard(preview.prompt);
            addToast({
              type: "success",
              message: "Copied prompt to clipboard.",
            });
          }}
        >
          <Text className="w-full flex-1">{preview.prompt}</Text>
        </Surface>

        <View className="flex-row gap-2 w-fit">
          <Surface className="p-1 gap-1.5 rounded-default flex-row" elevated>
            <IconButton
              alt="Desktop width"
              onClick={() => setLayout(Layout.DESKTOP)}
            >
              <RiComputerIcon />
            </IconButton>
            <IconButton
              alt="Tablet width"
              onClick={() => setLayout(Layout.TABLET)}
            >
              <RiTabletIcon />
            </IconButton>
            <IconButton
              alt="Smartphone width"
              onClick={() => setLayout(Layout.MOBILE)}
            >
              <RiSmartphoneIcon />
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

      <View className="h-full flex-1 grid place-items-center">
        {streaming || preview.code.length === 0 ? (
          <View className="gap-1 flex-row items-center">
            <RiLoader2Icon className="animate-[spin_2s_linear_infinite]" />
            <Text size="small" color="dimmer">
              Building your ideas
            </Text>
          </View>
        ) : (
          <PreviewFrame code={preview.code} />
        )}
      </View>
    </Surface>
  );
}
