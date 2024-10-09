import { useState } from "react";
import { Heading } from "tanukui/components/Heading.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { RiArrowLeftDoubleIcon } from "tanukui/icons/RiArrowLeftDoubleIcon.js";
import { RiArrowRightDoubleIcon } from "tanukui/icons/RiArrowRightDoubleIcon.js";
import { cn } from "tanukui/lib/cn.js";

import { HistoryPreview } from "./HistoryPreview";

export function PanelHistory() {
  const [expanded, setExpanded] = useState(true);

  return (
    <Surface
      elevated
      className={cn(
        "rounded-default h-fit p-2 duration-chill transition-all items-center",
        expanded && "w-48 items-stretch",
      )}
    >
      <View className="items-center justify-between flex-row">
        {expanded ? (
          <Heading level={2} size="subheadDefault">
            History
          </Heading>
        ) : null}
        <IconButton
          alt="Toggle history"
          onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
        >
          {expanded ? <RiArrowLeftDoubleIcon /> : <RiArrowRightDoubleIcon />}
        </IconButton>
      </View>

      <View className="mt-2 gap-2">
        <HistoryPreview version={0} active mini={!expanded} />
        <HistoryPreview version={1} mini={!expanded} />
      </View>
    </Surface>
  );
}
