import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { View } from "natmfat/components/View";
import { PreviewData, shitgen } from "~/.server/database/client";
import { notFound, requireTruthy } from "~/lib/utils.server";

import Header from "./components/Header";
import { PanelHistory } from "./components/PanelHistory";
import { PanelPreview } from "./components/PanelPreview";
import { RevisionsInput } from "./components/RevisionsInput";
import { ProjectStoreProvider } from "./hooks/useProjectStore";

export { action } from "./action.server";

export function createRoute(projectId: string) {
  return `/p/${projectId}`;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projectId;
  requireTruthy(projectId, notFound());

  const project = await shitgen.project
    .find({
      where: { id: projectId },
    })
    .catch(() => null);
  requireTruthy(project, notFound());

  return {
    projectId,
    project,
    previews: (await shitgen.preview
      .findMany({
        where: { project_id: projectId },
      })
      .catch(() => [])) as unknown as Array<PreviewData>,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    return [{ title: data.project.prompt }];
  }

  return [];
};

export default function Project() {
  const {
    projectId,
    project: { prompt },
    previews,
  } = useLoaderData<typeof loader>();

  return (
    <ProjectStoreProvider
      value={{
        projectId,
        initialPrompt: prompt,
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
