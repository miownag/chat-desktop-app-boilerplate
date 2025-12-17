import MessageList from "@/components/message-list";
import Sender from "@/components/sender";
import { useState } from "react";

function MainBox({ conversationId }: { conversationId: string }) {
  const [enableDeepThink, setEnableDeepThink] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);

  return (
    <>
      <MessageList conversationId={conversationId} />
      <Sender
        enableDeepThink={enableDeepThink}
        setEnableDeepThink={setEnableDeepThink}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
      />
    </>
  );
}

export default MainBox;
