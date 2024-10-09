import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEventSource } from "remix-utils/sse/react";
import { View } from "tanukui/components/View.js";
import { ModelPreview, ModelProject } from "~/.server/models";
import { notFound, requireTruthy } from "~/lib/utils.server";

import { createRoute } from "../api.ollama.$projectId.v0";
import Header from "./components/Header";
import { PanelHistory } from "./components/PanelHistory";
import { PanelPreview } from "./components/PanelPreview";
import { RevisionsInput } from "./components/RevisionsInput";
import { ProjectStoreProvider, useProjectStore } from "./hooks/useProjectStore";

// type ConvertibleMessage = {
//   role: string;
//   content: string;
// };

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
        <View className="flex-row gap-4 pt-0 h-full flex-1">
          <PanelHistory />
          <PanelPreview />
        </View>
        <RevisionsInput />
      </View>
    </ProjectStoreProvider>
  );
}
