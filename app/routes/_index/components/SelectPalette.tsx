import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "tanukui/components/Select.js";
import { View, ViewProps } from "tanukui/components/View.js";
import { cn } from "tanukui/lib/cn.js";
import { ModelPalette } from "~/.server/models";

export function SelectPalette({
  palettes,
}: {
  palettes: ModelPalette.Palette[];
}) {
  const [value, setValue] = useState(palettes[0].id.toString() as string);
  const selectedPalette = useMemo(
    () => palettes.find((palette) => palette.id.toString() === value)!,
    [value, palettes],
  );

  return (
    <Select
      name="palette_id"
      value={value}
      defaultValue={value}
      onValueChange={setValue}
    >
      <SelectTrigger>
        <SelectValue aria-label={value.toString()}>
          <PaletteThumbnail
            colors={selectedPalette.thumbnail_colors}
            className="mr-2"
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {palettes.map(({ id, name, thumbnail_colors }) => (
          <SelectItem key={id} value={id.toString()}>
            <PaletteThumbnail colors={thumbnail_colors} />
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PaletteThumbnail({
  colors,
  className,
  ...props
}: ViewProps & { colors: ModelPalette.Palette["thumbnail_colors"] }) {
  return (
    <View
      className={cn("flex-row rounded-md overflow-hidden", className)}
      {...props}
    >
      {colors.map((color) => (
        <View
          key={color}
          style={{ backgroundColor: color }}
          className="h-5 w-5"
        />
      ))}
    </View>
  );
}
