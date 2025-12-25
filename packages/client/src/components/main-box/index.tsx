import { pick } from 'es-toolkit';
import { useEffect, useState } from 'react';
import MessageList from '@/components/message-list';
import Sender from '@/components/sender';
import useGetMessages from '@/hooks/apis/use-get-messages';
import useChat from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/services';
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

  const { isRequesting, onRequest, messages, setMessages, abort } = useChat({
    requestFn: async ({
      message,
      enableDeepThink,
      enableSearch,
      signal,
      onSuccess,
      onError,
      onUpdate,
    }) => {
      sendMessage({
        params: {
          conversationId,
          content: message.content,
          enableDeepThink,
          enableSearch,
        },
        signal,
        onMessage: (chunk) => {
          console.log('onMessage123123', chunk);
          onUpdate(chunk);
        },
        onComplete: (fullMessage) => {
          onSuccess({
            content: fullMessage,
            status: 'completed',
          });
        },
        onError: (error) => {
          onError(error);
        },
      });
    },
  });
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
      // Add user message immediately
      const newUserMessage = {
        id: `msg-${crypto.randomUUID()}`,
        role: 'user',
        content: pendingMessage,
        status: 'completed' as const,
      };
      setPendingMessage(null);
      onRequest({
        message: newUserMessage,
        enableDeepThink,
        enableSearch,
      });
    }
  }, [
    isActive,
    pendingMessage,
    conversationId,
    onRequest,
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
      <MessageList isActive={isActive} messages={messages} />
      <Sender
        enableDeepThink={enableDeepThink}
        setEnableDeepThink={setEnableDeepThink}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        isActive={isActive}
        onRequest={onRequest}
        isRequesting={isRequesting}
        abort={abort}
      />
    </div>
  );
}

export default MainBox;
