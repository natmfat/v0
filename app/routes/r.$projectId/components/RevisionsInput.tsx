import { useState } from "react";
import { Avatar } from "tanukui/components/Avatar.js";
import { IconButton } from "tanukui/components/IconButton.js";
import { Separator } from "tanukui/components/Separator.js";
import { Surface } from "tanukui/components/Surface.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "tanukui/components/Tooltip.js";
import { RiCursorIcon } from "tanukui/icons/RiCursorIcon.js";
import { spaceTokens } from "tanukui/lib/tokens.js";

export function RevisionsInput() {
  const [value, setValue] = useState("");

  return (
    <Surface
      elevated
      className="relative left-1/2 -translate-x-1/2 rounded-full w-96 max-w-full flex-row items-center p-2 gap-2 shadow-1 flex-grow-0 flex-shrink-0"
    >
      <Avatar
        src="https://natmfat.com/logo.png"
        username="natmfat"
        size={spaceTokens.space32}
      />
      <Separator orientation="vertical" className="h-8" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-full w-full flex-1 bg-transparent outline-none border-none placeholder:text-foreground-dimmest text-foreground-default"
        placeholder="Make the heading larger and darker"
      />
      <Separator orientation="vertical" className="h-8" />
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            alt="Pick and edit"
            variant="outline"
            className="h-8 w-8 rounded-full"
          >
            <RiCursorIcon />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Pick and Edit</TooltipContent>
      </Tooltip>
    </Surface>
  );
}

// <form
//   onSubmit={async (e) => {
//     e.preventDefault();
//     return;
//     const nextMessages = [...messages, { role: "user", content: value }];
//     setMessages(nextMessages);
//     const response = await fetch(ROUTE, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         messages: nextMessages,
//         intent: Intent.GENERATE,
//       }),
//     });
// if (!response || !response.ok) {
//   return;
// }

// const output = await streamResponse({
//   response,
//   onChunk: (chunk) => {
//     setAnswer((prevAnswer) => [...prevAnswer, chunk]);
//   },
// });

// setMessages((prevMessages) => [
//   ...prevMessages,
//   { role: "assistant", content: output.join("") },
// ]);
//     setAnswer([]);
//   }}
// >
//   <View>
//     {[...messages, { role: "assistant", content: answer }].map(
//       (message, i) => (
//         <pre key={i}>{message.content}</pre>
//       ),
//     )}
//   </View>

//   <EditInput />
// </form>
