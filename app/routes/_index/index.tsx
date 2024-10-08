import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useId, useRef, useState } from "react";
import { Button } from "tanukui/components/Button.js";
import { Heading } from "tanukui/components/Heading.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { MultilineInput } from "tanukui/components/MultilineInput.js";
import { Pill } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { RiArrowRightIcon } from "tanukui/icons/RiArrowRightIcon.js";
import { RiArrowRightUpIcon } from "tanukui/icons/RiArrowRightUpIcon.js";
import { RiImageIcon } from "tanukui/icons/RiImageIcon.js";
import { RiLockUnlockIcon } from "tanukui/icons/RiLockUnlockIcon.js";

import { SelectPalette } from "../components/SelectPalette";
import { getRandomSuggestion, suggestions } from "../lib/suggestions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {
  return {
    serverRandom: Math.random(),
  };
}

export default function Index() {
  const { serverRandom } = useLoaderData<typeof loader>();
  const [value, setValue] = useState("");

  return (
    <View className="text-center items-center">
      <View className="max-w-lg w-full mx-auto">
        <Heading level={1} className="mt-28">
          Generate. Refine. Ship.
        </Heading>
        <Text multiline className="mt-1">
          Generate UI with repl-community/ui from text prompts and images.
        </Text>

        <Surface className="p-2 elevated border border-interactive rounded-default block mt-6 shadow-1">
          <MultilineInput
            placeholder={getRandomSuggestion(serverRandom)}
            className="w-full min-h-20 resize-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <View className="flex-row mt-2 justify-between">
            <View className="flex-row gap-2">
              <Button size={16} color="transparent">
                <RiImageIcon />
                Image
              </Button>
              <Button size={16} color="transparent">
                <RiLockUnlockIcon />
                Public
              </Button>

              <SelectPalette />
            </View>

            <IconButton alt="Submit" className="h-8 w-8" size={28}>
              <RiArrowRightIcon />
            </IconButton>
          </View>
        </Surface>
      </View>

      <View className="flex-row mt-6 gap-2">
        {Object.keys(suggestions).map((key) => (
          <Pill
            variant="fill"
            color="transparent"
            key={key}
            onClick={() => {
              setValue(suggestions[key]);
            }}
          >
            <Text>{key}</Text>
            <RiArrowRightUpIcon />
          </Pill>
        ))}
      </View>
    </View>
  );
}
