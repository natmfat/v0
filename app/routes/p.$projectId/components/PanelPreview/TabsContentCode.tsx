import { Button } from "natmfat/components/Button";
import { TabsContent } from "natmfat/components/Tabs";
import { ToastContext } from "natmfat/components/Toast";
import { View } from "natmfat/components/View";
import { RiClipboardIcon } from "natmfat/icons/RiClipboardIcon";
import { copyToClipboard } from "natmfat/lib/copyToClipboard";
import { tokens } from "natmfat/lib/tokens";
import { useContext } from "react";
import { CodeBlock, zenburn } from "react-code-blocks";

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
          size={tokens.space12}
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
