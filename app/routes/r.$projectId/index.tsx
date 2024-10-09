import { useLoaderData } from "@remix-run/react";
import { View } from "tanukui/components/View.js";

import Header from "./components/Header";
import { PanelHistory } from "./components/PanelHistory";
import { PanelPreview } from "./components/PanelPreview";
import { RevisionsInput } from "./components/RevisionsInput";
import { setInitialState } from "./hooks/useStore";

// type ConvertibleMessage = {
//   role: string;
//   content: string;
// };

export function loader() {
  return {
    query: "A list of product categories with image, name and description.",
  };
}

export default function Project() {
  const { query } = useLoaderData<typeof loader>();
  setInitialState({ initialQuery: query });

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
