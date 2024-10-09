import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { View } from "tanukui/components/View.js";
import { notFound, requireTruthy } from "~/lib/utils.server";
import { ModelProject } from "~/models.server";

import Header from "./components/Header";
import { PanelHistory } from "./components/PanelHistory";
import { PanelPreview } from "./components/PanelPreview";
import { RevisionsInput } from "./components/RevisionsInput";
import { useProjectStore } from "./hooks/useProjectStore";

// type ConvertibleMessage = {
//   role: string;
//   content: string;
// };

export async function loader({ params }: LoaderFunctionArgs) {
  requireTruthy(params.projectId, notFound());
  const project = await ModelProject.find({ id: params.projectId });
  requireTruthy(project, notFound());

  return {
    ...project,
  };
}

export default function Project() {
  const { project_prompt } = useLoaderData<typeof loader>();
  useProjectStore.setState({ initialPrompt: project_prompt });

  return (
    <View className="h-screen items-stretch gap-4 p-4">
      <Header />

      <View className="flex-row gap-4 pt-0 h-full flex-1">
        <PanelHistory />
        <PanelPreview />
      </View>

      <RevisionsInput />
    </View>
  );
}
