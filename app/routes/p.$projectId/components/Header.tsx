import { Link } from "@remix-run/react";
import { Avatar } from "tanukui/components/Avatar.js";
import { Button } from "tanukui/components/Button.js";
import { Pill } from "tanukui/components/Pill.js";
import { Separator } from "tanukui/components/Separator.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { RiLockUnlockIcon } from "tanukui/icons/RiLockUnlockIcon.js";
import { spaceTokens } from "tanukui/lib/tokens.js";
import { ROUTE } from "~/routes/_index";

import { useProjectStore } from "../hooks/useProjectStore";

export default function Header() {
  const prompt = useProjectStore((state) => state.initialPrompt);

  return (
    <header className="flex flex-row items-center justify-between flex-grow-0 flex-shrink-0">
      <View className="flex-row gap-3 items-center">
        <View className="flex-row gap-2 items-center">
          <Avatar
            src="https://natmfat.com/logo.png"
            username="natmfat"
            size={spaceTokens.space32}
          />
          <Separator orientation="vertical" className="h-8" />
          <Text className="max-w-80">{prompt}</Text>
        </View>

        <Pill color="transparent">
          <RiLockUnlockIcon />
          Public
        </Pill>
      </View>
      <View className="flex-row gap-2">
        <Button size={16} color="transparent" asChild>
          <Link to={ROUTE}>New Generation</Link>
        </Button>
        <Button size={16} color="transparent" variant="outline">
          Feedback
        </Button>
      </View>
    </header>
  );
}
