import { useCallback } from "react";
import { Interactive } from "tanukui/components/Interactive.js";
import { Pill, PillProps } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";

import { useProjectStore } from "../../hooks/useProjectStore";

interface HistoryPreviewProps {
  version: number;
  active?: boolean;
  mini?: boolean;
}

export function HistoryPreview(props: HistoryPreviewProps) {
  const setSelectedVersion = useProjectStore(
    (store) => store.setSelectedVersion,
  );

  const onClick = useCallback(() => {
    setSelectedVersion(props.version);
  }, [props.version]);

  if (props.mini) {
    return (
      <MiniHistoryPreview
        {...props}
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
          "h-24 rounded-default",
          props.active && "border-primary-dimmer active:border-primary-default",
        )}
      >
        <Surface elevated={!props.mini} className="absolute bottom-1 left-1">
          <MiniHistoryPreview version={props.version} active={props.active} />
        </Surface>
      </View>
    </Interactive>
  );
}

function MiniHistoryPreview({
  version,
  active,
  className,
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
      v{version}
    </Pill>
  );
}
