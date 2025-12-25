import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';

const CHAT_END_POINT = 'http://localhost:3000/api/messages/send';

const useBricksChat = (id?: string) => {
  const { status, messages, sendMessage, setMessages, stop, regenerate } =
    useChat<UIMessage<{ feedback?: 'liked' | 'disliked' }>>({
      id,
      transport: new DefaultChatTransport({
        api: CHAT_END_POINT,
        credentials: 'include',
        prepareSendMessagesRequest: ({ messages, id, body, credentials }) => {
          return {
            body: {
              message: messages[messages.length - 1],
              id,
              ...body,
            },
            credentials,
          };
        },
      }),
    });

  return {
    status,
    messages,
    sendMessage,
    setMessages,
    stop,
    regenerate,
  };
};

export type ChatHookType = ReturnType<typeof useBricksChat>;
export default useBricksChat;
