import { useRef } from "react";
import { ChatContainerContent, ChatContainerRoot } from "../ui/chat-container";
import { ScrollButton } from "../ui/scroll-button";
import AssistantMessage from "./components/assistant-message";
import UserMessage from "./components/user-message";
import useGetMessages from "@/hooks/apis/use-get-messages";
import Welcome from "../welcome";

export type ChatMessage = {
  id: number;
  role: string;
  content: string;
  feedback?: "liked" | "disliked";
};

interface MessageListProps {
  conversationId: string;
  isActive: boolean;
}

function MessageList({ conversationId, isActive }: MessageListProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { data } = useGetMessages({
    conversationId,
  });

  if (!isActive) {
    return null;
  }

  return data?.data?.data?.length > 0 ? (
    <div
      ref={chatContainerRef}
      className="relative flex-1 overflow-y-auto w-2xl"
    >
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="space-y-0 px-5 py-12">
          {data?.data?.data?.map((message: ChatMessage, index: number) =>
            message.role === "assistant" ? (
              <AssistantMessage
                message={message}
                isLastMessage={index === data?.data?.data?.length - 1}
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
  ) : (
    <Welcome />
  );
}

export default MessageList;
