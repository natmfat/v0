import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Anchor } from "tanukui/components/Anchor.js";
import { Button } from "tanukui/components/Button.js";
import { Heading } from "tanukui/components/Heading.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Interactive } from "tanukui/components/Interactive.js";
import { MultilineInput } from "tanukui/components/MultilineInput.js";
import { Pill } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import { View } from "tanukui/components/View.js";
import { RiArrowRightIcon } from "tanukui/icons/RiArrowRightIcon.js";
import { RiArrowRightUpIcon } from "tanukui/icons/RiArrowRightUpIcon.js";
import { RiImageIcon } from "tanukui/icons/RiImageIcon.js";
import { RiLockUnlockIcon } from "tanukui/icons/RiLockUnlockIcon.js";
import { ModelPalette, ModelProject } from "~/.server/models";

import { createRoute } from "../p.$projectId";
import { SelectPalette } from "./components/SelectPalette";
import { getRandomSuggestion, suggestions } from "./lib/suggestions";

export { action } from "./action.server";

export const ROUTE = "/";

export const meta: MetaFunction = () => {
  return [
    { title: "v0" },
    {
      name: "description",
      content:
        "Generate UI with repl-community/ui from text prompts and images.",
    },
  ];
};

export async function loader() {
  return {
    stableSuggestion: getRandomSuggestion(Math.random()),
    palettes: await ModelPalette.findAll(),
    projects: await ModelProject.findAllWithPreview(),
  };
}

export default function Index() {
  const { stableSuggestion, palettes, projects } =
    useLoaderData<typeof loader>();
  const [value, setValue] = useState("");

  return (
    <View className="max-w-4xl w-full mx-auto px-6 h-full text-center items-center">
      <View className="max-w-lg w-full mx-auto">
        <Heading level={1} className="mt-28">
          Generate. Refine. Ship.
        </Heading>
        <Text multiline className="mt-1">
          Generate UI with repl-community/ui from text prompts and images.
        </Text>
        <Surface
          className="p-2 elevated border border-interactive rounded-default block mt-6 shadow-1"
          asChild
        >
          <Form method="POST">
            <MultilineInput
              required
              placeholder={stableSuggestion}
              className="w-full min-h-20 resize-none"
              name="prompt"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (value === "" && e.key === "Tab") {
                  e.preventDefault();
                  setValue(stableSuggestion);
                }
              }}
            />
            <View className="flex-row mt-2 justify-between">
              <View className="flex-row gap-2">
                <Button size={16} color="transparent" type="button">
                  <RiImageIcon />
                  Image
                </Button>
                <Button size={16} color="transparent" type="button">
                  <RiLockUnlockIcon />
                  Public
                </Button>
                <SelectPalette palettes={palettes} />
              </View>
              <IconButton
                alt="Submit"
                className="h-8 w-8"
                size={28}
                type="submit"
              >
                <RiArrowRightIcon />
              </IconButton>
            </View>
          </Form>
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
      <View className="mt-28 grid grid-cols-3 gap-4 w-full">
        {projects.map((project) => (
          <Link key={project.project_id} to={createRoute(project.project_id)}>
            <View className="gap-2 text-center">
              <Interactive>
                <img src={project.thumbnail_src} alt={project.prompt} />
              </Interactive>
              <Text maxLines={2}>{project.prompt}</Text>
            </View>
          </Link>
        ))}
      </View>
      <footer className="h-28 grid place-items-center">
        <Anchor href="https://natmfat.com" target="_blank" rel="noreferrer">
          natmfat.com
        </Anchor>
      </footer>
    </View>
  );
}
