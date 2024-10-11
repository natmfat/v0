import { Form } from "@remix-run/react";
import { useState } from "react";
import { Avatar } from "tanukui/components/Avatar.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Separator } from "tanukui/components/Separator.js";
import { Surface } from "tanukui/components/Surface.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "tanukui/components/Tooltip.js";
import { RiCursorIcon } from "tanukui/icons/RiCursorIcon.js";
import { spaceTokens } from "tanukui/lib/tokens.js";
import { Intent } from "~/components/Intent";

import { useProjectStore } from "../hooks/useProjectStore";
import { useRemixForm } from "../hooks/useRemixForm";
import { ActionIntent } from "../types";

export function RevisionsInput() {
  const [value, setValue] = useState("");
  const setSelectedVersion = useProjectStore(
    (store) => store.setSelectedVersion,
  );

  const { formRef } = useRemixForm({
    onSuccess: ({ data }) => {
      setValue("");
      if (data && "version" in data && typeof data.version === "number") {
        setSelectedVersion(data.version);
      }
    },
  });

  return (
    <Surface
      elevated
      className="relative left-1/2 -translate-x-1/2 rounded-full w-96 max-w-full flex-row items-center p-2 gap-2 shadow-1 flex-grow-0 flex-shrink-0"
    >
      <Avatar
        src="https://natmfat.com/logo.png"
        username="natmfat"
        size={spaceTokens.space32}
      />
      <Separator orientation="vertical" className="h-8" />
      <Form method="POST" className="w-full" ref={formRef}>
        <input
          name="prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          className="h-full w-full flex-1 bg-transparent outline-none border-none placeholder:text-foreground-dimmest text-foreground-default"
          placeholder="Make the heading larger and darker"
        />
        <Intent value={ActionIntent.NEW_VERSION} />
      </Form>
      <Separator orientation="vertical" className="h-8" />
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            alt="Pick and edit"
            variant="outline"
            className="h-8 w-8 rounded-full"
          >
            <RiCursorIcon />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Pick and Edit</TooltipContent>
      </Tooltip>
    </Surface>
  );
}
