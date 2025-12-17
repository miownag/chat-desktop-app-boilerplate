import { useCallback, useRef, useState } from "react";

type Message = {
  id: string | number;
  role: string;
  content: string;
};

type UseChatOptions<TMessage extends Message, TParsedMessage> = {
  // Request function that sends messages to the server
  requestFn: (
    messages: TMessage[],
    signal: AbortSignal
  ) => Promise<TMessage | TMessage[]>;
  // Initial history messages
  historyMessages?: TMessage[];
  // Message transformer to convert raw messages to parsed format
  messageTransformer?: (messages: TMessage[]) => TParsedMessage[];
};

type UseChatReturn<TMessage extends Message, TParsedMessage> = {
  // Abort the current request
  abort: () => void;
  // Whether a request is in progress
  isRequesting: boolean;
  // Raw messages array
  messages: TMessage[];
  // Transformed messages using the provided transformer
  parsedMessages: TParsedMessage[];
  // Trigger a request with optional new message
  onRequest: (newMessage?: TMessage) => Promise<void>;
  // Directly set messages without triggering a request
  setMessages: React.Dispatch<React.SetStateAction<TMessage[]>>;
};

function useChat<TMessage extends Message, TParsedMessage = TMessage>(
  options: UseChatOptions<TMessage, TParsedMessage>
): UseChatReturn<TMessage, TParsedMessage> {
  const { requestFn, historyMessages = [], messageTransformer } = options;

  const [messages, setMessages] = useState<TMessage[]>(historyMessages);
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
    async (newMessage?: TMessage) => {
      // Abort any existing request
      abort();

      // Create new AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Add new message to the list if provided
      let currentMessages = messages;
      if (newMessage) {
        currentMessages = [...messages, newMessage];
        setMessages(currentMessages);
      }

      setIsRequesting(true);

      try {
        const response = await requestFn(currentMessages, controller.signal);

        // Handle response - can be single message or array
        const responseMessages = Array.isArray(response) ? response : [response];

        setMessages((prev) => [...prev, ...responseMessages]);
      } catch (error) {
        // Don't throw if the request was aborted
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        throw error;
      } finally {
        setIsRequesting(false);
        abortControllerRef.current = null;
      }
    },
    [messages, requestFn, abort]
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

export default useChat;
