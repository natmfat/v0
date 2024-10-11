export function processLines(text: string) {
  // process text
  // if surrounded in markdown code blocks, remove them
  const lines = text
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0);
  if (lines[0] && lines[0].startsWith("```")) {
    lines.shift();
  }
  if (lines[lines.length - 1] && lines[lines.length - 1].endsWith("```")) {
    lines.pop();
  }
  return lines.join("\n");
}
