import { Nullable } from "node_modules/shitgen/dist/types";
import { PreviewData } from "~/.server/database/client";

export function findPreview(
  previews: PreviewData[],
  version: number,
): Nullable<PreviewData> {
  return previews.find((preview) => preview.version === version) || null;
}
