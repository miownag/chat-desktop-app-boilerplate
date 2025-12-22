import { useRef } from 'react';
import type { Message } from '@/hooks/use-chat';
import { ChatContainerContent, ChatContainerRoot } from '../ui/chat-container';
import { ScrollButton } from '../ui/scroll-button';
import Welcome from '../welcome';
import AssistantMessage from './components/assistant-message';
import UserMessage from './components/user-message';

export type ChatMessage = {
  id: number;
  role: string;
  content: string;
  feedback?: 'liked' | 'disliked';
};

interface MessageListProps {
  messages: Message[];
  isActive: boolean;
}

function MessageList({ messages, isActive }: MessageListProps) {
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
        <ChatContainerContent className="space-y-0 px-5 py-12">
          {messages.map((message: Message, index: number) =>
            message.role === 'assistant' ? (
              <AssistantMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
              />
            ) : (
              <UserMessage key={message.id} message={message} />
            ),
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
