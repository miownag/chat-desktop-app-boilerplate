import { useRef } from "react";
import { ChatContainerContent, ChatContainerRoot } from "../ui/chat-container";
import { ScrollButton } from "../ui/scroll-button";
import AssistantMessage from "./components/assistant-message";
import UserMessage from "./components/user-message";

export type ChatMessage = {
  id: number;
  role: string;
  content: string;
};

interface MessageListProps {
  chatMessages: ChatMessage[];
}

function MessageList({ chatMessages }: MessageListProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto">
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="space-y-0 px-5 py-12">
          {chatMessages.map((message, index) =>
            message.role === "assistant" ? (
              <AssistantMessage
                message={message}
                isLastMessage={index === chatMessages.length - 1}
              />
            ) : (
              <UserMessage message={message} />
            )
          )}
        </ChatContainerContent>
        <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
          <ScrollButton className="shadow-sm" />
        </div>
      </ChatContainerRoot>
    </div>
  );
}

export default MessageList;
