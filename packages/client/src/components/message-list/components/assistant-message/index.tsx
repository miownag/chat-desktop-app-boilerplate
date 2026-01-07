import { useState } from 'react';
import { AiOutlineSync } from 'react-icons/ai';
import { LuCopy } from 'react-icons/lu';
import { MdCheck } from 'react-icons/md';
import {
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from 'react-icons/ri';
import MessagePartRenderer from '@/components/message-list/components/message-renderer';
import { Button } from '@/components/ui/button';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from '@/components/ui/message';
import useFeedback from '@/hooks/apis/use-feedback';
import type { ChatHookType } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';

interface AssistantMessageProps {
  conversationId: string;
  message: ChatHookType['messages'][0];
  status: ChatHookType['status'];
  isLastMessage?: boolean;
  regenerate: (options?: { messageId?: string | undefined }) => Promise<void>;
  onFeedbackUpdate: (
    messageId: string,
    feedback: 'liked' | 'disliked' | undefined,
  ) => void;
}

function AssistantMessage({
  conversationId,
  message,
  isLastMessage,
  status,
  regenerate,
  onFeedbackUpdate,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const { mutate: submitFeedbackMutation } = useFeedback();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        message.parts
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join(''),
      );
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (actionType: 'like' | 'dislike') => {
    const currentFeedback = message.metadata?.feedback;
    const action =
      (currentFeedback === 'liked' && actionType === 'like') ||
      (currentFeedback === 'disliked' && actionType === 'dislike')
        ? 'cancel'
        : 'submit';

    submitFeedbackMutation(
      {
        conversationId,
        messageId: message.id,
        actionType,
        action,
      },
      {
        onSuccess: () => {
          // Update local state
          const newFeedback =
            action === 'cancel'
              ? undefined
              : actionType === 'like'
                ? 'liked'
                : 'disliked';
          onFeedbackUpdate(message.id, newFeedback);
        },
        onError: (error) => {
          console.error('Failed to submit feedback:', error);
        },
      },
    );
  };

  const handleOnRegenerate = () => {
    regenerate({ messageId: message.id });
  };

  return (
    <Message
      key={message.id}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 items-start"
    >
      <div className="group flex w-full flex-col gap-0">
        <MessageContent className="text-foreground prose flex-1 rounded-lg bg-transparent p-0">
          {message.parts.map((part, index) => (
            <MessagePartRenderer
              key={`${part.type}-${index}`}
              part={part}
              isThinking={
                index === message.parts.length - 1 && status === 'streaming'
              }
            />
          ))}
        </MessageContent>
        {((isLastMessage && status === 'ready') || !isLastMessage) && (
          <MessageActions
            className={cn('flex gap-0 opacity-0 group-hover:opacity-100 mt-2', {
              'opacity-100': isLastMessage,
            })}
          >
            {isLastMessage && (
              <MessageAction tooltip="Re-Generate" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  onClick={handleOnRegenerate}
                >
                  <AiOutlineSync />
                </Button>
              </MessageAction>
            )}
            <MessageAction
              tooltip={copied ? 'Copied!' : 'Copy'}
              delayDuration={100}
            >
              {!copied ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  onClick={handleCopy}
                >
                  <LuCopy />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                >
                  <MdCheck color="green" />
                </Button>
              )}
            </MessageAction>
            <MessageAction tooltip="Upvote" delayDuration={100}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                onClick={() => handleFeedback('like')}
              >
                {message.metadata?.feedback === 'liked' ? (
                  <RiThumbUpFill />
                ) : (
                  <RiThumbUpLine />
                )}
              </Button>
            </MessageAction>
            <MessageAction tooltip="Downvote" delayDuration={100}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                onClick={() => handleFeedback('dislike')}
              >
                {message.metadata?.feedback === 'disliked' ? (
                  <RiThumbDownFill />
                ) : (
                  <RiThumbDownLine />
                )}
              </Button>
            </MessageAction>
          </MessageActions>
        )}
      </div>
    </Message>
  );
}

export default AssistantMessage;
