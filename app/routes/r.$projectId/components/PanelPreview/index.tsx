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

import { useStore } from "../../hooks/useStore";

export function PanelPreview() {
  const query = useStore((store) => store.initialQuery);

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
          <Text className="w-full flex-1">{query}</Text>
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

      <View className="h-full flex-1">
        <iframe
          title="Component Preview"
          srcDoc=""
          className="border border-interactive rounded-default h-full flex-1"
        />

        {/* @todo 3 variants */}
      </View>
    </Surface>
  );
}
