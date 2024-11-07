import { PreviewData } from "database/client";
import { Nullable } from "node_modules/shitgen/dist/types";

export function findPreview(
  previews: PreviewData[],
  version: number,
): Nullable<PreviewData> {
  return previews.find((preview) => preview.version === version) || null;
}
