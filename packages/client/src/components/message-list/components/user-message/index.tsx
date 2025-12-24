import { useState } from 'react';
import { LuCopy } from 'react-icons/lu';
import { MdCheck } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from '@/components/ui/message';
import UserAvatar from '@/components/user-avatar';
import { useAuth } from '@/hooks/apis/use-auth';
import type { Message as MessageType } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';

interface UserMessageProps {
  message: MessageType;
}

function UserMessage({ message }: UserMessageProps) {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Message
      key={message.id}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 items-start"
    >
      <div className="group flex flex-col items-end gap-1 w-full">
        <div className="flex flex-row-reverse gap-4 w-full">
          <UserAvatar user={user} />
          <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
            {message.content}
          </MessageContent>
        </div>
        <MessageActions
          className={cn('mr-10 flex gap-0 opacity-0 group-hover:opacity-100')}
        >
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
        </MessageActions>
      </div>
    </Message>
  );
}

export default UserMessage;
