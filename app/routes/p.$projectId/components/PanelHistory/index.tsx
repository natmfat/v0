import { useState } from "react";
import { Heading } from "tanukui/components/Heading.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { RiArrowLeftDoubleIcon } from "tanukui/icons/RiArrowLeftDoubleIcon.js";
import { RiArrowRightDoubleIcon } from "tanukui/icons/RiArrowRightDoubleIcon.js";
import { cn } from "tanukui/lib/cn.js";

import { useProjectStore } from "../../hooks/useProjectStore";
import { HistoryPreview } from "./HistoryPreview";

export function PanelHistory() {
  const [expanded, setExpanded] = useState(true);
  const previews = useProjectStore((store) => store.previews);
  const selectedVersion = useProjectStore((store) => store.selectedVersion);

  return (
    <Surface
      elevated
      className={cn(
        "rounded-default overflow-hidden max-h-full h-fit p-2 duration-chill transition-all justify-stretch",
        expanded && "w-48",
      )}
    >
      <View
        className={cn(
          "flex-row items-center justify-between border-b pb-2 bg-surface z-10 flex-shrink-0",
          !expanded && "justify-center",
        )}
      >
        {expanded ? (
          <Heading level={2} size="subheadDefault">
            History
          </Heading>
        ) : null}
        <IconButton
          alt="Toggle history"
          onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
          variant="fill"
        >
          {expanded ? <RiArrowLeftDoubleIcon /> : <RiArrowRightDoubleIcon />}
        </IconButton>
      </View>

      <View className="flex-1 pt-2 gap-2 overflow-y-auto">
        {previews.map((preview) => (
          <HistoryPreview
            key={preview.id}
            mini={!expanded}
            preview={preview}
            active={selectedVersion === preview.version}
          />
        ))}
      </View>
    </Surface>
  );
}
