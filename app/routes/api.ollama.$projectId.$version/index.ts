export { loader } from "./loader.server";

export function createRoute(projectId: string, version: number) {
  return `/api/ollama/${projectId}/${version}`;
}
