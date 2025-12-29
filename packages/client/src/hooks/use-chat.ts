import { useChat } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { QueryKeys } from '@/constants';

const CHAT_END_POINT = 'http://localhost:3000/api/messages/send';

const useBricksChat = (id?: string) => {
  const queryClient = useQueryClient();
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
      onFinish: () => {
        if (messages.length === 0) {
          // Update title of conversation if it's the first message
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.CONVERSATION_LIST],
          });
        }
      },
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
