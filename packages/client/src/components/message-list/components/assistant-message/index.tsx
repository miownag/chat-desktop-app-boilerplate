import CopyBtn from "@/components/copy-btn";
import type { ChatMessage } from "@/components/message-list";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineSync } from "react-icons/ai";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";

interface AssistantMessageProps {
  message: ChatMessage;
  isLastMessage?: boolean;
}

function AssistantMessage({ message, isLastMessage }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Message
      key={message.id}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 items-start"
    >
      <div className="group flex w-full flex-col gap-0">
        <div className="flex gap-4 w-full">
          <MessageAvatar src="https://github.com/ibelick.png" alt="Ibelick" />
          <MessageContent
            className="text-foreground prose flex-1 rounded-lg bg-transparent p-0"
            markdown
          >
            {message.content}
          </MessageContent>
        </div>
        <MessageActions
          className={cn(
            "ml-10 flex gap-0 opacity-0 group-hover:opacity-100",
            isLastMessage && "opacity-100"
          )}
        >
          <MessageAction tooltip="Re-Generate" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <AiOutlineSync />
            </Button>
          </MessageAction>
          <MessageAction tooltip="Copy" delayDuration={100}>
            <CopyBtn
              content={message.content}
              copied={copied}
              setCopied={setCopied}
            />
          </MessageAction>
          <MessageAction tooltip="Upvote" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <LuThumbsUp />
            </Button>
          </MessageAction>
          <MessageAction tooltip="Downvote" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <LuThumbsDown />
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}

export default AssistantMessage;
