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
    <TabsContent value={value} asChild>
      <View className="flex-1 max-h-full overflow-hidden relative rounded-default font-mono flex [&>span]:h-full">
        <Button
          size={12}
          className="absolute bottom-2 right-2"
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
