import invariant from "invariant";
import { useContext } from "react";
import { Button } from "tanukui/components/Button.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Separator } from "tanukui/components/Separator.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { ToastContext } from "tanukui/components/Toast.js";
import { View } from "tanukui/components/View.js";
import { RiCodeIcon } from "tanukui/icons/RiCodeIcon.js";
import { RiComputerIcon } from "tanukui/icons/RiComputerIcon.js";
import { RiExternalLinkIcon } from "tanukui/icons/RiExternalLinkIcon.js";
import { RiLayoutIcon } from "tanukui/icons/RiLayoutIcon.js";
import { RiLoader2Icon } from "tanukui/icons/RiLoader2Icon.js";
import { RiPaintIcon } from "tanukui/icons/RiPaintIcon.js";
import { RiSmartphoneIcon } from "tanukui/icons/RiSmartphoneIcon.js";
import { RiTabletIcon } from "tanukui/icons/RiTabletIcon.js";
import { createRoute } from "~/routes/api.iframe.$projectId.$version[.html]";

import { Layout, useProjectStore } from "../../hooks/useProjectStore";
import { useRequestStream } from "../../hooks/useRequestStream";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { findPreview } from "../../lib/projectStoreUtils";
import { PreviewFrame } from "./PreviewFrame";

export function PanelPreview() {
  const projectId = useProjectStore((store) => store.projectId);
  const streaming = useProjectStore((store) => store.streaming);

  const preview = useProjectStore((store) =>
    findPreview(store.previews, store.selectedVersion),
  );
  invariant(preview, "expected preview");

  const showCode = useProjectStore((store) => store.showCode);
  const setShowCode = useProjectStore((store) => store.setShowCode);
  const setLayout = useProjectStore((store) => store.setLayout);

  const { addToast } = useContext(ToastContext);

  useRequestStream(preview);

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
            <Separator orientation="vertical" />
            <IconButton alt="Open preview in new tab" asChild>
              <a
                href={createRoute(projectId, preview.version)}
                target="_blank"
                rel="noreferrer"
              >
                <RiExternalLinkIcon />
              </a>
            </IconButton>
          </Surface>

          <Button size={16} color="transparent" variant="outline">
            <RiPaintIcon />
            Theme
          </Button>
          <Button
            size={16}
            color="transparent"
            className="w-[85px]"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? (
              <>
                <RiCodeIcon />
                Code
              </>
            ) : (
              <>
                <RiLayoutIcon />
                Canvas
              </>
            )}
          </Button>
        </View>
      </View>

      {streaming ? (
        <View className="h-full flex-1 grid place-items-center">
          <View className="gap-1 flex-row items-center">
            <RiLoader2Icon className="animate-[spin_2s_linear_infinite]" />
            <Text size="small" color="dimmer">
              Building your ideas
            </Text>
          </View>
        </View>
      ) : (
        <PreviewFrame {...preview} />
      )}
    </Surface>
  );
}
