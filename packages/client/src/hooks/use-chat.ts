import { useCallback, useRef, useState } from 'react';

type Message = {
  id: string;
  role: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  reason?: string;
  feedback?: 'liked' | 'disliked';
};

type OnRequestParams = {
  message: Message;
  enableDeepThink: boolean;
  enableSearch: boolean;
};

type UseChatOptions<TParsedMessage> = {
  // Request function that sends messages to the server
  requestFn: (params: {
    message: Message;
    enableDeepThink: boolean;
    enableSearch: boolean;
    signal: AbortSignal;
    // Callback to update partial messages as they arrive
    onUpdate: (chunk: string) => void;
    // Callback when the request completes
    onSuccess: (message: Pick<Message, 'content' | 'status'>) => void;
    // Callback when the request errors
    onError: (error: Error) => void;
  }) => Promise<void>;
  // Initial history messages
  historyMessages?: Message[];
  // Message transformer to convert raw messages to parsed format
  messageTransformer?: (messages: Message[]) => TParsedMessage[];
};

type UseChatReturn<TParsedMessage> = {
  // Abort the current request
  abort: () => void;
  // Whether a request is in progress
  isRequesting: boolean;
  // Raw messages array
  messages: Message[];
  // Transformed messages using the provided transformer
  parsedMessages: TParsedMessage[];
  // Trigger a request with optional new message
  onRequest: (params: OnRequestParams) => Promise<void>;
  // Directly set messages without triggering a request
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

function useChat<TParsedMessage = Message>(
  options: UseChatOptions<TParsedMessage>,
): UseChatReturn<TParsedMessage> {
  const { requestFn, historyMessages = [], messageTransformer } = options;

  const [messages, setMessages] = useState<Message[]>(historyMessages);
  const [isRequesting, setIsRequesting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Abort the current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsRequesting(false);
    }
  }, []);

  // Trigger a request with optional new message
  const onRequest = useCallback(
    async (params: OnRequestParams) => {
      const { message, enableDeepThink, enableSearch } = params;
      // Abort any existing request
      abort();

      // Create new AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Add new message to the list if provided
      if (message) {
        setMessages((prev) => {
          console.log('3', [...prev, message]);
          return [...prev, message];
        });
      }

      setIsRequesting(true);

      try {
        await requestFn({
          message,
          enableDeepThink,
          enableSearch,
          signal: controller.signal,
          onUpdate: (chunk: string, id?: string) => {
            console.log('chunk1', chunk);
            setMessages((prev) => {
              if (prev[prev.length - 1].role === 'user') {
                console.log('1', [
                  ...prev,
                  {
                    id: id || crypto.randomUUID(),
                    role: 'assistant',
                    content: chunk,
                    status: 'pending',
                  },
                ]);
                return [
                  ...prev,
                  {
                    id: id || crypto.randomUUID(),
                    role: 'assistant',
                    content: chunk,
                    status: 'pending',
                  },
                ];
              } else if (
                prev[prev.length - 1].role === 'assistant' &&
                prev[prev.length - 1].status === 'pending'
              ) {
                console.log('2', [
                  ...prev.slice(0, -1),
                  {
                    ...prev[prev.length - 1],
                    content: prev[prev.length - 1].content + chunk,
                  },
                ]);
                return [
                  ...prev.slice(0, -1),
                  {
                    ...prev[prev.length - 1],
                    content: prev[prev.length - 1].content + chunk,
                  },
                ];
              }
              return prev;
            });
          },
          onSuccess: (message: Pick<Message, 'content' | 'status'>) => {
            setMessages((prev) => {
              console.log('4', [
                ...prev.slice(0, -1),
                {
                  id: prev[prev.length - 1].id,
                  role: 'assistant',
                  status: message.status || 'completed',
                  content: message.content || '',
                },
              ]);
              return [
                ...prev.slice(0, -1),
                {
                  id: prev[prev.length - 1].id,
                  role: 'assistant',
                  status: message.status || 'completed',
                  content: message.content || '',
                },
              ];
            });
          },
          onError: (error: Error) => {
            setMessages((prev) => {
              console.log('5', [
                ...prev.slice(0, -1),
                {
                  ...prev[prev.length - 1],
                  status: 'error',
                  reason: error.message || 'Unknown error',
                },
              ]);
              return [
                ...prev.slice(0, -1),
                {
                  ...prev[prev.length - 1],
                  status: 'error',
                  reason: error.message || 'Unknown error',
                },
              ];
            });
          },
        });

        // Handle response - can be single message or array
        // const responseMessages = Array.isArray(response)
        //   ? response
        //   : [response];

        // setMessages((prev) => [...prev, ...responseMessages]);
      } catch (error) {
        // Don't throw if the request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        throw error;
      } finally {
        setIsRequesting(false);
        abortControllerRef.current = null;
      }
    },
    [requestFn, abort],
  );

  // Compute parsed messages using the transformer
  const parsedMessages = messageTransformer
    ? messageTransformer(messages)
    : (messages as unknown as TParsedMessage[]);

  return {
    abort,
    isRequesting,
    messages,
    parsedMessages,
    onRequest,
    setMessages,
  };
}

export type { Message, OnRequestParams };

export default useChat;
