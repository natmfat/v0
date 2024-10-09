import { Interactive } from "tanukui/components/Interactive.js";
import { Pill } from "tanukui/components/Pill.js";
import { Surface } from "tanukui/components/Surface.js";
import { View } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";

interface HistoryPreviewProps {
  version: number;
  active?: boolean;
  mini?: boolean;
}

export function HistoryPreview({
  version,
  active,
  mini,
}: {
  version: number;
  active?: boolean;
  mini?: boolean;
}) {
  if (mini) {
    return <MiniHistoryPreview version={version} active={active} />;
  }

  return (
    <Interactive>
      <View
        className={cn(
          "h-24 rounded-default",
          active && "border-primary-dimmer active:border-primary-default",
        )}
      >
        <Surface elevated={!mini} className="absolute bottom-1 left-1">
          <MiniHistoryPreview version={version} active={active} />
        </Surface>
      </View>
    </Interactive>
  );
}

function MiniHistoryPreview({
  version,
  active,
}: Omit<HistoryPreviewProps, "mini">) {
  return (
    <Pill
      color={active ? "primary" : "grey"}
      className={cn(
        "font-mono w-10 select-none cursor-pointer",
        active && "bg-colorway-dimmest",
      )}
      variant="outlineStatic"
    >
      v{version}
    </Pill>
  );
}
