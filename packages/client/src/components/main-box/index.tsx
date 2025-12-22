import { pick } from 'es-toolkit';
import { useEffect, useState } from 'react';
import MessageList from '@/components/message-list';
import Sender from '@/components/sender';
import useGetMessages from '@/hooks/apis/use-get-messages';
import useChat from '@/hooks/use-chat';
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

  const { isRequesting, onRequest, messages, setMessages, abort } = useChat({
    requestFn: (messages, enableDeepThink, enableSearch, signal) => {
      console.log('params', {
        messages,
        enableDeepThink,
        enableSearch,
        signal,
      });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            content: `## Hello World!
          
This message supports **bold text**, *italics*, and other Markdown features:

- Bullet points
- Code blocks
- [Links](https://example.com)

\`\`\`js
// Even code with syntax highlighting
function hello() {
  return "world";
}
\`\`\`
`,
            role: 'assistant',
          });
        }, 1000);
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

  // 当组件挂载且有pendingMessage时，自动发送消息
  useEffect(() => {
    if (isActive && pendingMessage && conversationId !== 'new') {
      // Add user message immediately
      const newUserMessage = {
        id: `msg-${crypto.randomUUID()}`,
        role: 'user',
        content: pendingMessage,
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
