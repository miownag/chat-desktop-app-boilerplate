import MessageList from "@/components/message-list";
import Sender from "@/components/sender";
import { cn } from "@/lib/utils";
import { useState } from "react";

function MainBox({
  conversationId,
  isActive,
}: {
  conversationId: string;
  isActive: boolean;
}) {
  const [enableDeepThink, setEnableDeepThink] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);

  return (
    <div
      className={cn(
        "p-2 flex-1 flex flex-col items-center justify-center overflow-auto",
        isActive ? "" : "hidden"
      )}
    >
      <MessageList conversationId={conversationId} isActive={isActive} />
      <Sender
        enableDeepThink={enableDeepThink}
        setEnableDeepThink={setEnableDeepThink}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        isActive={isActive}
      />
    </div>
  );
}

export default MainBox;
