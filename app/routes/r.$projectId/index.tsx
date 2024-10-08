import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Avatar } from "tanukui/components/Avatar.js";
import { Button } from "tanukui/components/Button.js";
import { Heading } from "tanukui/components/Heading.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Interactive } from "tanukui/components/Interactive.js";
import { Pill } from "tanukui/components/Pill.js";
import { Separator } from "tanukui/components/Separator.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { RiArrowLeftDoubleIcon } from "tanukui/icons/RiArrowLeftDoubleIcon.js";
import { RiComputerIcon } from "tanukui/icons/RiComputerIcon.js";
import { RiFullscreenIcon } from "tanukui/icons/RiFullscreenIcon.js";
import { RiLayoutIcon } from "tanukui/icons/RiLayoutIcon.js";
import { RiLockUnlockIcon } from "tanukui/icons/RiLockUnlockIcon.js";
import { RiPaintIcon } from "tanukui/icons/RiPaintIcon.js";
import { RiSmartphoneIcon } from "tanukui/icons/RiSmartphoneIcon.js";
import { RiTabletIcon } from "tanukui/icons/RiTabletIcon.js";
import { spaceTokens } from "tanukui/lib/tokens.js";

import { RevisionsInput } from "./components/RevisionsInput";

type ConvertibleMessage = {
  role: string;
  content: string;
};

export function loader({ params }: LoaderFunctionArgs) {
  return {
    query: "A list of product categories with image, name and description.",
  };
}

export default function Project() {
  const [messages, setMessages] = useState<ConvertibleMessage[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const { query } = useLoaderData<typeof loader>();

  return (
    <View className="h-screen items-stretch gap-4 p-4">
      <header className="flex flex-row items-center justify-between flex-grow-0 flex-shrink-0">
        <View className="flex-row gap-3 items-center">
          <View className="flex-row gap-2 items-center">
            <Avatar
              src="https://natmfat.com/logo.png"
              username="natmfat"
              size={spaceTokens.space32}
            />
            <Separator orientation="vertical" className="h-8" />
            <Text className="max-w-80">{query}</Text>
          </View>

          <Pill color="transparent">
            <RiLockUnlockIcon />
            Public
          </Pill>
        </View>
        <View className="flex-row gap-2">
          <Button size={16} color="transparent">
            New Generation
          </Button>
          <Button size={16} color="transparent" variant="outline">
            Feedback
          </Button>
        </View>
      </header>

      <View className="flex-row gap-4 pt-0 h-full flex-1">
        <Surface elevated className="rounded-default h-fit w-48 p-2">
          <View className="items-center justify-between flex-row">
            <Heading level={2} size="subheadDefault">
              History
            </Heading>
            <IconButton alt="Toggle history">
              <RiArrowLeftDoubleIcon />
            </IconButton>
          </View>

          <View className="mt-2 gap-2">
            <Interactive>
              <View className="h-20 rounded-default">
                <Pill
                  color="primary"
                  className="absolute bottom-1 left-1 font-mono w-10 bg-colorway-dimmest select-none"
                  variant="outlineStatic"
                >
                  v0
                </Pill>
              </View>
            </Interactive>
          </View>
        </Surface>
        <Surface
          elevated
          className="p-2 gap-2 h-full flex-1 w-full rounded-default"
        >
          <View className="flex-row justify-between flex-shrink-0 flex-grow-0">
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
            <View className="flex-row gap-2">
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
      </View>

      <RevisionsInput />
    </View>
  );
}
