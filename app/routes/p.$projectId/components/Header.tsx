import { Link } from "@remix-run/react";
import { Avatar } from "natmfat/components/Avatar";
import { Button } from "natmfat/components/Button";
import { Pill } from "natmfat/components/Pill";
import { Separator } from "natmfat/components/Separator";
import { Text } from "natmfat/components/Text";
import { View } from "natmfat/components/View";
import { RiLockUnlockIcon } from "natmfat/icons/RiLockUnlockIcon";
import { spaceTokens } from "natmfat/lib/tokens";
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
        <Button color="transparent" asChild>
          <Link to={ROUTE}>New Generation</Link>
        </Button>
        <Button color="transparent" variant="outline">
          Feedback
        </Button>
      </View>
    </header>
  );
}
