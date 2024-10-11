import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { View } from "tanukui/components/View.js";
import { ModelPreview, ModelProject } from "~/.server/models";
import { notFound, requireTruthy } from "~/lib/utils.server";

import Header from "./components/Header";
import { PanelHistory } from "./components/PanelHistory";
import { PanelPreview } from "./components/PanelPreview";
import { RevisionsInput } from "./components/RevisionsInput";
import { ProjectStoreProvider } from "./hooks/useProjectStore";

export { action } from "./action.server";

export enum ActionIntent {
  UPDATE_THUMBNAIL = "UPDATE_THUMBNAIL",
  NEW_VERSION = "NEW_VERSION",
}

export function createRoute(projectId: string) {
  return `/p/${projectId}`;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projectId;
  requireTruthy(projectId, notFound());
  const project = await ModelProject.find({ id: projectId });
  requireTruthy(project, notFound());
  const previews = await ModelPreview.find({ project_id: projectId });

  return {
    projectId,
    project,
    previews,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    return [{ title: data.project.project_prompt }];
  }

  return [];
};

export default function Project() {
  const {
    projectId,
    project: { project_prompt },
    previews,
  } = useLoaderData<typeof loader>();

  return (
    <ProjectStoreProvider
      value={{
        projectId,
        initialPrompt: project_prompt,
        previews,
      }}
    >
      <View className="h-screen items-stretch gap-4 p-4">
        <Header />
        <View className="flex-row gap-4 pt-0 h-full flex-1 overflow-hidden">
          <PanelHistory />
          <PanelPreview />
        </View>
        <RevisionsInput />
      </View>
    </ProjectStoreProvider>
  );
}
