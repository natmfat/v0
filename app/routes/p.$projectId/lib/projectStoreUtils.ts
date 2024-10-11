import { Preview } from "~/.server/models/ModelPreview";
import { Nullable } from "~/lib/types";

export function findPreview(
  previews: Preview[],
  version: number,
): Nullable<Preview> {
  return previews.find((preview) => preview.version === version) || null;
}
