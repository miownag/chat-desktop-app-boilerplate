import { useRef } from 'react';
import AssistantMessage from '@/components/message-list/components/assistant-message';
import UserMessage from '@/components/message-list/components/user-message';
import {
  ChatContainerContent,
  ChatContainerRoot,
} from '@/components/ui/chat-container';
import { Loader } from '@/components/ui/loader';
import { ScrollButton } from '@/components/ui/scroll-button';
import Welcome from '@/components/welcome';
import type { ChatHookType } from '@/hooks/use-chat';

export type ChatMessage = {
  id: number;
  role: string;
  content: string;
  feedback?: 'liked' | 'disliked';
};

interface MessageListProps {
  messages: ChatHookType['messages'];
  status: ChatHookType['status'];
  isActive: boolean;
  regenerate: ChatHookType['regenerate'];
}

function MessageList({
  messages,
  status,
  isActive,
  regenerate,
}: MessageListProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  if (!isActive) {
    return null;
  }

  return messages.length > 0 ? (
    <div
      ref={chatContainerRef}
      className="relative flex-1 overflow-y-auto w-2xl"
    >
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="space-y-0 pr-4 py-12">
          {messages.map((message, index) =>
            message.role === 'assistant' ? (
              <AssistantMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
                status={status}
                regenerate={regenerate}
              />
            ) : (
              <UserMessage key={message.id} message={message} />
            ),
          )}
          {status === 'submitted' && <Loader variant="typing" />}
        </ChatContainerContent>
        <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-center px-5">
          <ScrollButton className="shadow-sm cursor-pointer" />
        </div>
      </ChatContainerRoot>
    </div>
  ) : (
    <Welcome />
  );
}

export default MessageList;
