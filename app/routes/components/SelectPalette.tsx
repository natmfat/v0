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

import { DEFAULT_PALETTE, Palette, palettes } from "../lib/palettes";

export function SelectPalette() {
  const [value, setValue] = useState(DEFAULT_PALETTE);
  const paletteValue = useMemo(
    () => palettes.find((palette) => palette.name === value)!,
    [value],
  );

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue aria-label={value}>
          <PalettePreview colors={paletteValue.colors} className="mr-2" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {palettes.map(({ name, colors }) => (
          <SelectItem key={name} value={name}>
            <PalettePreview colors={colors} />
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PalettePreview({
  colors,
  className,
  ...props
}: ViewProps & { colors: Palette["colors"] }) {
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
