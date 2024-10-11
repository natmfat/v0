export { loader } from "./loader.server";

export function createRoute(projectId: string) {
  return `/api/ollama/${projectId}`;
}
