import { useCallback } from "react";
import { Interactive } from "tanukui/components/Interactive.js";
import { Loading } from "tanukui/components/Loading.js";
import { Pill, PillProps } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { Text } from "tanukui/components/Text.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "tanukui/components/Tooltip.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";
import { type Preview } from "~/.server/models/ModelPreview";

import { useProjectStore } from "../../hooks/useProjectStore";
import { useRequestScreenshot } from "../../hooks/useRequestScreenshot";

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

  useRequestScreenshot(preview);

  return (
    <Tooltip>
      <TooltipTrigger>
        {mini ? (
          <MiniHistoryPreview
            {...{ active, preview }}
            preview={preview}
            variant="outline"
            onClick={onClick}
            color={active ? "primary" : "transparent"}
          />
        ) : (
          <Interactive>
            <View
              className={cn(
                "relative overflow-hidden rounded-default",
                active && "border-primary-dimmer active:border-primary-default",
              )}
              onClick={onClick}
            >
              <Loading loading={!preview.thumbnail_src}>
                <View className="h-24">
                  {preview.thumbnail_src ? (
                    <img
                      alt={preview.prompt}
                      src={preview.thumbnail_src}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : null}
                </View>
              </Loading>

              <Surface
                elevated
                className="absolute bottom-1 left-1 bg-transparent"
              >
                <MiniHistoryPreview {...{ active, preview }} />
              </Surface>
            </View>
          </Interactive>
        )}
      </TooltipTrigger>
      <TooltipContent side="right">
        <View className="gap-1 max-w-44">
          <Loading loading={!preview.thumbnail_src}>
            <View className="h-24 border border-interactive rounded-default overflow-hidden">
              {preview.thumbnail_src ? (
                <img
                  alt={preview.prompt}
                  src={preview.thumbnail_src}
                  className="h-full w-full object-cover object-top"
                />
              ) : null}
            </View>
          </Loading>
          <Text maxLines={2} className="flex-1" size="small">
            {preview.prompt}
          </Text>
        </View>
      </TooltipContent>
    </Tooltip>
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
