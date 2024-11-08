import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Anchor } from "natmfat/components/Anchor";
import { Button } from "natmfat/components/Button";
import { Heading } from "natmfat/components/Heading";
import { IconButton } from "natmfat/components/IconButton";
import { Interactive } from "natmfat/components/Interactive";
import { MultilineInput } from "natmfat/components/MultilineInput";
import { Pill } from "natmfat/components/Pill";
import { Surface } from "natmfat/components/Surface";
import { Text } from "natmfat/components/Text";
import { View } from "natmfat/components/View";
import { RiArrowRightIcon } from "natmfat/icons/RiArrowRightIcon";
import { RiArrowRightUpIcon } from "natmfat/icons/RiArrowRightUpIcon";
import { RiImageIcon } from "natmfat/icons/RiImageIcon";
import { RiLockUnlockIcon } from "natmfat/icons/RiLockUnlockIcon";
import { tokens } from "natmfat/lib/tokens";
import { useState } from "react";
import {
  PreviewData,
  ProjectData,
  shitgen,
  sql,
} from "~/.server/database/client";

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
      content: "Generate UI with text prompts and images.",
    },
  ];
};

export async function loader() {
  return {
    stableSuggestion: getRandomSuggestion(Math.random()),
    palettes: await shitgen.palette.findMany({}),
    projects: await sql<
      Array<
        Pick<ProjectData, "id" | "prompt"> &
          Pick<PreviewData, "version" | "thumbnail_src">
      >
    >`
      SELECT project_.id AS id, project_.prompt AS prompt, preview_.version AS version, preview_.thumbnail_src AS thumbnail_src FROM project_
      LEFT JOIN preview_ ON project_.id = preview_.project_id
      WHERE preview_.version = 0 AND project_.public = true;
    `,
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
          Generate UI with text prompts and images.
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
                <Button color="transparent" type="button">
                  <RiImageIcon />
                  Image
                </Button>
                <Button color="transparent" type="button">
                  <RiLockUnlockIcon />
                  Public
                </Button>
                <SelectPalette palettes={palettes} />
              </View>
              <IconButton
                alt="Submit"
                className="h-8 w-8"
                size={tokens.space28}
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
          <Link key={project.id} to={createRoute(project.id)}>
            <View className="gap-2 text-center">
              {project.thumbnail_src ? (
                <Interactive>
                  <img src={project.thumbnail_src} alt={project.prompt} />
                </Interactive>
              ) : null}
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
