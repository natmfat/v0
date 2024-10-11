import { useCallback } from "react";
import { Interactive } from "tanukui/components/Interactive.js";
import { Pill, PillProps } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";
import { type Preview } from "~/.server/models/ModelPreview";

import { useProjectStore } from "../../hooks/useProjectStore";

interface HistoryPreviewProps {
  active?: boolean;
  mini?: boolean;
  preview: Preview;
}

export function HistoryPreview({ preview, ...props }: HistoryPreviewProps) {
  const setSelectedVersion = useProjectStore(
    (store) => store.setSelectedVersion,
  );

  const onClick = useCallback(() => {
    setSelectedVersion(preview.version);
  }, [preview.version]);

  if (props.mini) {
    return (
      <MiniHistoryPreview
        {...props}
        preview={preview}
        variant="outline"
        onClick={onClick}
        color={props.active ? "primary" : "transparent"}
      />
    );
  }

  return (
    <Interactive>
      <View
        onClick={onClick}
        className={cn(
          "h-24 rounded-default overflow-hidden",
          props.active && "border-primary-dimmer active:border-primary-default",
        )}
      >
        <img
          alt={preview.prompt}
          src={preview.thumbnail_src}
          className="h-full w-full"
        />
        <Surface elevated={!props.mini} className="absolute bottom-1 left-1">
          <MiniHistoryPreview preview={preview} {...props} />
        </Surface>
      </View>
    </Interactive>
  );
}

function MiniHistoryPreview({
  active,
  className,
  preview,
  ...props
}: HistoryPreviewProps & PillProps) {
  return (
    <Pill
      color={active ? "primary" : "grey"}
      className={cn(
        "font-mono w-10 select-none cursor-pointer",
        active && "bg-colorway-dimmest",
        className,
      )}
      variant="outlineStatic"
      {...props}
    >
      v{preview.version}
    </Pill>
  );
}
