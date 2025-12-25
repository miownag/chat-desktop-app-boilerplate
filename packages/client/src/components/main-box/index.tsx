import { pick } from 'es-toolkit';
import { useEffect, useState } from 'react';
import MessageList from '@/components/message-list';
import Sender from '@/components/sender';
import useGetMessages from '@/hooks/apis/use-get-messages';
import useBricksChat from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { useShallowChatBotStore } from '@/stores';

function MainBox({
  conversationId,
  isActive,
}: {
  conversationId: string;
  isActive: boolean;
}) {
  const [enableDeepThink, setEnableDeepThink] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const { pendingMessage, setPendingMessage } = useShallowChatBotStore(
    (state) => pick(state, ['pendingMessage', 'setPendingMessage']),
  );

  const { status, messages, sendMessage, setMessages, stop, regenerate } =
    useBricksChat(conversationId);

  const { data, isSuccess } = useGetMessages({
    conversationId,
  });

  // Set initial messages
  useEffect(() => {
    if (pendingMessage) {
      // If there is a pending message, must be a new conversation
      return;
    }
    if (isSuccess && data?.data?.data?.length > 0) {
      setMessages(data.data.data);
    }
  }, [isSuccess, data?.data?.data, setMessages, pendingMessage]);

  useEffect(() => {
    if (isActive && pendingMessage && conversationId !== 'new') {
      setPendingMessage(null);
      sendMessage(
        {
          text: pendingMessage,
        },
        {
          body: {
            enableDeepThink,
            enableSearch,
          },
        },
      );
    }
  }, [
    isActive,
    pendingMessage,
    conversationId,
    sendMessage,
    enableDeepThink,
    enableSearch,
    setPendingMessage,
  ]);

  return (
    <div
      className={cn(
        'p-2 flex-1 flex flex-col items-center justify-center overflow-auto',
        isActive ? '' : 'hidden',
      )}
    >
      <MessageList
        isActive={isActive}
        messages={messages}
        regenerate={regenerate}
      />
      <Sender
        enableDeepThink={enableDeepThink}
        setEnableDeepThink={setEnableDeepThink}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        isActive={isActive}
        sendMessage={sendMessage}
        status={status}
        stop={stop}
      />
    </div>
  );
}

export default MainBox;
