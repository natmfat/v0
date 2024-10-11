import { useCallback } from "react";
import { Interactive } from "tanukui/components/Interactive.js";
import { Loading } from "tanukui/components/Loading.js";
import { Pill, PillProps } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";
import { type Preview } from "~/.server/models/ModelPreview";

import { useProjectStore } from "../../hooks/useProjectStore";

interface HistoryPreviewProps {
  mini?: boolean;
  active?: boolean;
  preview: Preview;
}

export function HistoryPreview({ mini, active, preview }: HistoryPreviewProps) {
  const setSelectedVersion = useProjectStore(
    (store) => store.setSelectedVersion,
  );

  const onClick = useCallback(() => {
    setSelectedVersion(preview.version);
  }, [preview.version, setSelectedVersion]);

  if (mini) {
    return (
      <MiniHistoryPreview
        {...{ active, preview }}
        preview={preview}
        variant="outline"
        onClick={onClick}
        color={active ? "primary" : "transparent"}
      />
    );
  }

  return (
    <Interactive>
      <Loading loading={!preview.thumbnail_src}>
        <View
          onClick={onClick}
          className={cn(
            "h-24 rounded-default overflow-hidden",
            active && "border-primary-dimmer active:border-primary-default",
          )}
        >
          {preview.thumbnail_src ? (
            <img
              alt={preview.prompt}
              src={preview.thumbnail_src}
              className="h-full w-full object-cover object-top"
            />
          ) : null}
          <Surface elevated className="absolute bottom-1 left-1 bg-transparent">
            <MiniHistoryPreview {...{ active, preview }} />
          </Surface>
        </View>
      </Loading>
    </Interactive>
  );
}

function MiniHistoryPreview({
  active,
  preview,
  className,
  ...props
}: Omit<HistoryPreviewProps, "mini"> & PillProps) {
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
