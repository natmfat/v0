import { useContext } from "react";
import { CodeBlock, zenburn } from "react-code-blocks";
import { Button } from "tanukui/components/Button.js";
import { TabsContent } from "tanukui/components/Tabs.js";
import { ToastContext } from "tanukui/components/Toast.js";
import { View } from "tanukui/components/View.js";
import { RiClipboardIcon } from "tanukui/icons/RiClipboardIcon.js";

import { copyToClipboard } from "../../lib/copyToClipboard";

interface TabsContentCodeProps {
  code: string;
  value: string;
  language?: string;
}

export function TabsContentCode({
  code,
  value,
  language = "jsx",
}: TabsContentCodeProps) {
  const { addToast } = useContext(ToastContext);

  return (
    <TabsContent value={value} className="h-full flex-1">
      <View className="rounded-default overflow-hidden h-full flex-1 max-w-full font-mono [&>span]:h-full relative border">
        <Button
          size={12}
          className="absolute top-2 right-2"
          color="transparent"
          onClick={() => {
            addToast({
              type: "success",
              message: "Copied code to clipboard.",
            });
            copyToClipboard(code);
          }}
        >
          <RiClipboardIcon />
          Copy
        </Button>
        <CodeBlock
          text={code}
          language={language}
          showLineNumbers={false}
          theme={zenburn}
        />
      </View>
    </TabsContent>
  );
}
